import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import blueSound from '../assets/sounds/blue.mp3'
import greenSound from '../assets/sounds/green.mp3'
import redSound from '../assets/sounds/red.mp3'
import yellowSound from '../assets/sounds/yellow.mp3'
import wrongSound from '../assets/sounds/wrong.mp3'
import upload from '../assets/upload.png'
import mute from '../assets/mute.png'
import unmute from '../assets/unmute.png'

export default function Game() {

    const [start, setStart] = useState(false);
    const [level, setLevel] = useState(0);
    const [userClickedPattern, setUserClickedPattern] = useState([]);
    const [gamePattern, setGamePattern] = useState([]);
    const [animateButton, setAnimateButton] = useState("");
    const [buttonClass, setButtonClass] = useState("");
    const [toggleField, setToggleField] = useState(false);
    const [toggleLeaderboard, setToggleLeaderboard] = useState(false);
    const [restart, setRestart] = useState(false);
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [isMute,setIsMute] = useState(false);
    const [isBest,setIsBest] = useState(false);
    const navigate = useNavigate();
    
    const nextSequence = () => {      
        setUserClickedPattern([]);
        setLevel(prevlevel => prevlevel+1);
        var randomNumber=Math.floor(Math.random()*4);
        var randomChosenColour = buttonColours[randomNumber];
        setGamePattern(gamePattern => [...gamePattern, randomChosenColour]);
        !isMute && playSound(randomChosenColour);
        setAnimateButton(randomChosenColour);
        setTimeout(() => setAnimateButton(""), 300);
    }

    const playSound = (name) => {
        let soundFile;
        switch (name) {
            case 'blue':
                soundFile = blueSound;
                break;
            case 'green':
                soundFile = greenSound;
                break;
            case 'red':
                soundFile = redSound;
                break;
            case 'yellow':
                soundFile = yellowSound;
                break;
            case 'wrong':
                soundFile = wrongSound;
                break;
            default:
                console.log(`No sound file found for name: ${name}`);
                return;
        }
        var audio = new Audio(soundFile);
        audio.play();
    }

    const buttonColours=["red", "blue", "green", "yellow"]; 

    const handleButtonClick = (color) => {
        let temp = userClickedPattern.concat(color);
        setUserClickedPattern(temp);
        !isMute && playSound(color);
        setButtonClass(color);
        setTimeout(() => setButtonClass(""), 100);
        checkAnswer(temp);
    }

    const checkAnswer = (temp) => {
        if (gamePattern[temp.length-1] === temp[temp.length-1]) {
            if(temp.length===level)
            {
                setTimeout(() => { nextSequence();}, 1000);
            }
        }
        else {
            var audio = new Audio(wrongSound);
            audio.play();
            setGamePattern([]);
            if(!localStorage.getItem("best")) {
                localStorage.setItem("best",level-1);
                setIsBest(true);
            }
            if(localStorage.getItem("best") < level-1) {
                console.log("Asc");
                localStorage.setItem("best",level-1);
                setIsBest(true);
            }
            setRestart(true);
        }
    }

    const getData = async () => {
        fetch("https://simon-game-backend.onrender.com/leaderboard")
        .then(response => {
            return response.json()
        })
        .then(res => {
            setData(res);
        })
        .catch(error => {
            alert("Error fetching leaderboard")
        })
    }

    const save = async () => {
        fetch("https://simon-game-backend.onrender.com/save", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, score: level-1 })
        })
        .then((res) => {
            if(!res.ok) {
                alert("Error saving score");
            }
            else {
                setDisableSubmit(true);
            }
        })
        .catch(error => {
            alert("Error saving score");
        })
    }

  return (
    <div>
        <div style={{ position: 'absolute', top: 15, right: 15 }}>
            {isMute ? <img src={mute} className='save-button' width="64px" onClick={() => {setIsMute(isMute => !isMute)}}/> : <img src={unmute} className='save-button' width="64px" onClick={() => {setIsMute(isMute => !isMute)}}/>}
        </div>
        {restart ? 
            <div style={{display: "flex", flexDirection: "column", alignItems: "center",marginTop:"1%"}}>
                {isBest ? <h5 id="level-title">Game Over! New High Score:{level-1}</h5> : <h5 id="level-title">Game Over! Score : {level-1}</h5>}
                <button id="title-button" onClick={() => {setRestart(false);setStart(false);setLevel(0);setDisableSubmit(false);setName("");setIsBest(false);}}>Restart</button>
                <button id="title-button" onClick={() => {setToggleField(toggleField => !toggleField)}}>Submit Score</button>
                {toggleField && <div style={{display:"flex", justifyContent:"center",margin:"1%"}}><input className='save' placeholder={name || 'Name'} disabled={disableSubmit} value={name} onChange={(e) => {setName(e.target.value)}}/><img src={upload} width="36px" className='save-button' style={disableSubmit ? {opacity: "0.5"} : {}} onClick={() => {!disableSubmit && save()}}/></div>}
                <button id="title-button" onClick={() => {setToggleLeaderboard(toggleLeaderboard => !toggleLeaderboard);getData();}}>Leaderboard</button>
                {toggleLeaderboard &&
                    (data ? data.slice(0, 10).map((i,index) => {
                        return <div key={i._id} style={{display:"flex",flexDirection:"row",width:"300px",justifyContent:"space-between",fontFamily:"'Press Start 2P',cursive",color:"#FEF2BF",marginBottom:"1%"}}>
                            <div style={{display:"flex",flexDirection:"row"}}>
                                <div style={{color: (index+1 === 1) ? 'gold' : (index+1 === 2) ? 'silver' : (index+1 === 3) ? '#CD7F32' : '',width:"60px"}}>{index+1}</div>
                                <div style={{color: (index+1 === 1) ? 'gold' : (index+1 === 2) ? 'silver' : (index+1 === 3) ? '#CD7F32' : ''}}>{i.name}</div>
                            </div> 
                            <div style={{color: (index+1 === 1) ? 'gold' : (index+1 === 2) ? 'silver' : (index+1 === 3) ? '#CD7F32' : ''}}>{i.score}</div>
                        </div>
                    }) : "")
                }
            </div> : 
            <div>
                {start ? <h5 id="level-title">Level {level}</h5> : <div><button id="title-button" onClick={() => {nextSequence();setStart(prevStart => !prevStart)}}>Start</button><br/><button id="title-button" onClick={() => {navigate('/leaderboard')}}>Leaderboard</button></div>}
                <div className="container">

                    <div lass="row">
                        <div type="button" id="blue" className={"btn blue "+ (animateButton==="blue" ? "fadeInOut" : "") + (buttonClass==="blue" ? "pressed" : "")} onClick={() => {start && handleButtonClick("blue")}}></div>
                        <div type="button" id="yellow" className={"btn yellow "+ (animateButton==="yellow" ? "fadeInOut" : "") + (buttonClass==="yellow" ? "pressed" : "")} onClick={() => {start && handleButtonClick("yellow")}}></div>
                        </div>

                    <div className="row">
                        <div type="button" id="red" className={"btn red "+ (animateButton==="red" ? "fadeInOut" : "") + (buttonClass==="red" ? "pressed" : "")} onClick={() => {start && handleButtonClick("red")}}></div>
                        <div type="button" id="green" className={"btn green "+ (animateButton==="green" ? "fadeInOut" : "") + (buttonClass==="green" ? "pressed" : "")} onClick={() => {start && handleButtonClick("green")}}></div>
                    </div>

                </div>
            </div>
        }
        
    </div>
  )
}
