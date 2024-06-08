import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import back from '../assets/back.png'

export default function Leaderboard() {

    const [data,setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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
    },[])

  return (
    <div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"left",margin:"1%"}}>
            <img className='save-button' src={back} alt="" width="64px" onClick={() => {navigate("/")}}/>
        </div>
        <h1 style={{fontFamily:"'Press Start 2P',cursive",color:"#FEF2BF",fontSize:"3rem"}}>Leaderboard</h1>
        <div style={{display:"flex", flexDirection:"column",alignItems:"center"}}>
            {data.map((i,index) => {
            return <div key={i._id} style={{display:"flex",flexDirection:"row",width:"400px",justifyContent:"space-between",fontFamily:"'Press Start 2P',cursive",color:"#FEF2BF",marginBottom:"1.5%",fontSize:"larger"}}>
                        <div style={{display:"flex",flexDirection:"row"}}>
                            <div style={{color: (index+1 === 1) ? 'gold' : (index+1 === 2) ? 'silver' : (index+1 === 3) ? '#CD7F32' : ''}}>{index+1}&nbsp;</div>
                            <div style={{color: (index+1 === 1) ? 'gold' : (index+1 === 2) ? 'silver' : (index+1 === 3) ? '#CD7F32' : ''}}>{i.name}</div>
                        </div> 
                        <div style={{color: (index+1 === 1) ? 'gold' : (index+1 === 2) ? 'silver' : (index+1 === 3) ? '#CD7F32' : ''}}>{i.score}</div>
                    </div>
            })}
        </div>
    </div>
  )
}
