import { useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [user,setUser] = useState([])
  const [filterUser,setFilterUser] = useState([])
  const [touch,setTouch] = useState(false)
  const [userData,setUserData] = useState({name:"",age:"",city:""})

  const getUserData = async()=>{
     await axios.get("http://localhost:8500/users").then((res)=>{
       setUser(res.data) 
       setFilterUser(res.data) 
     })
  }
  useEffect(()=>{
     getUserData()
     
  },[])

  const searchUser = (e)=>{
    
    const value = e.target.value.toLowerCase()
    const filterDatas = user.filter((use)=>(
     use.name.toLowerCase().includes(value) || use.city.toLowerCase().includes(value)
    )) 
    setFilterUser(filterDatas)
  }

  const deleteUser = async(id)=>{
     const isConfirmed = window.confirm("Are you sur to delete")
     if(isConfirmed){
     await axios.delete(`http://localhost:8500/users/${id}`).then((res)=>{
      setUser(res.data) 
      setFilterUser(res.data) 
     })
     }
  }
  const handleAddUser = ()=>{
    setUserData({name:"",age:"",city:""})
    setTouch(true)
  }
  const closeModal = ()=>{
    setTouch(false)
    getUserData()
  }
  const handleData = (e)=>{
    setUserData({...userData,[e.target.name]:e.target.value})
  }
  const handleSubmit = async(e)=>{
     e.preventDefault()
     if(userData.id){
      await axios.patch(`http://localhost:8500/users/${userData.id}`,userData).then((res)=>{
        
       })
     }
     else{
     await axios.post("http://localhost:8500/users",userData).then((res)=>{
    
     })
    }
    touch()
    setUserData({...userData,[e.target.name]:e.target.value})
  }
  const updateUser = (user)=>{
     setUserData(user)
     setTouch(true)
  }
  return (
    <>
      <div className='container'>
         <h2>CRUD application with react.js and node.js</h2>
         <div className='headsearch'>
             <input type="search" placeholder="Search text here" onChange={(e)=>searchUser(e)}/>
             <button className='adduser' onClick={handleAddUser}>ADD USER</button>
         </div>
         <table>
            <thead>
                <tr>
                   <th>s.no</th>
                   <th>name</th>
                   <th>age</th>
                   <th>city</th>
                   <th>edit</th>
                   <th>delete</th>
                </tr>
            </thead>
            <tbody>
              {filterUser && filterUser.map((use,index)=>(
                 <tr key={use.id}>
                  <td>{index+1}</td>
                  <td>{use.name}</td>
                  <td>{use.age}</td>
                  <td>{use.city}</td>
                  <td>
                   <button className='green' onClick={()=>updateUser(use)}>edit</button>
                 </td>
                  <td>
                   <button className='red' onClick={()=>deleteUser(use.id)}>delete</button>
                 </td>
               </tr>)
              )}
            </tbody>
         </table>
         {touch && (
            <div className="modal">
                 <div className="modal-con">
                    <span className='close' onClick={closeModal}>&times;</span>
                    <h3 className='heading'>{userData.id?"update record":"user record"}</h3>
                    <div className="input_box">
                        <label htmlFor="name">full name</label>
                        <input type="text" name="name" id="name" onChange={handleData} value={userData.name}/>
                    </div>
                    <div className="input_box">
                        <label htmlFor="age">age</label>
                        <input type="Number" name="age" id="age" onChange={handleData} value={userData.age}/>
                    </div>
                    <div className="input_box">
                        <label htmlFor="city">city</label>
                        <input type="text" name="city" id="city" 
                        onChange={handleData} value={userData.city}/>
                    </div>
                    <button className='btn' onClick={handleSubmit}>{userData.id?"update user":"Add user"}</button>
                 </div>
            </div>
         )}
      </div>
    </>
  )
}

export default App
