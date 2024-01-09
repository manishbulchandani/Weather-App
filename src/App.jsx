import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  HStack,
  Text,
  Flex,
  Input,
  Icon,
  Button,
  Image,
} from "@chakra-ui/react";

import { FiSun } from "react-icons/fi";
import { LuCloudSun } from "react-icons/lu";
import { IoRainy } from "react-icons/io5";
import { IoThunderstorm } from "react-icons/io5";
import { IoSnowSharp } from "react-icons/io5";

import { IoLocationSharp } from "react-icons/io5";

import drainy from "./assets/daytime_rainy.jpg";
import nrainy from "./assets/night_rainy.jpg";

import dclear from "./assets/daytime_clear.jpg";
import eclearncloudy from "./assets/evening.jpg";
import nclear from "./assets/night_clear.jpg";

import dcloudy from "./assets/daytime_cloudy.jpg"

function App() {
  const [city, setCity] = useState("Ajmer");
  const [data, setData] = useState();
  const [time,setTime] = useState(null); 
  const [notFound,setNotFound]=useState(false)
  const [background,setbackground]=useState(dclear)
  const [icon,setIcon]=useState(<Icon as={FiSun} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0"/>)


  const changebackground=(weatherdata,timedata)=>{
    const desc=weatherdata.weather[0].icon
    if(desc==="09d" || desc==="10d"||desc==="11d"||desc==="13d"||desc==="50d" ){
      if(desc==="09d" || desc==="10d"){
        setIcon(<Icon as={IoRainy} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0"/>)
      }
      else if(desc=="11d"){
        setIcon(<Icon as={IoThunderstorm} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0"/>)
      }
      else{
        setIcon(<Icon as={IoSnowSharp} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0"/>)
      }
      if(timedata.hour<19 && timedata.hour>6 ){
        setbackground(drainy)
      }
      else{
        setbackground(nrainy)
      }
    } 
    
    else if(desc==="01d"){
      setIcon(<Icon as={FiSun} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0"/>)
      if(timedata.hour<17 && timedata.hour>=6){
        setbackground(dclear)
      }
      else if (timedata.hour>=17 && timedata.hour<19){
        setbackground(eclearncloudy)
      }
      else if (timedata.hour>=19 || timedata.hour<6){
        setbackground(nclear)
      }
    }
    else{
      setIcon(<Icon as={LuCloudSun} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0"/>)
      if(timedata.hour<17 && timedata.hour>=6){
        setbackground(dcloudy)
      }
      else if (timedata.hour>=17 && timedata.hour<19){
        setbackground(eclearncloudy)
      }
      else if (timedata.hour>=19 || timedata.hour<6){
        setbackground(nclear)
      }
    }
  }
  const fetchData=()=>{
    setNotFound(false)
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`)
      .then(response => {
        setData(response.data);
        fetchTime(response.data)
      })
      .catch(error => { 
        setNotFound(true)
        console.error('Error fetching data:', error);
      });
  }

  const fetchTime=(weatherdata)=>{
    axios.get(`https://api.api-ninjas.com/v1/worldtime?city=${weatherdata.name}`,{
      headers:{
        "X-Api-Key":import.meta.env.VITE_WORLDTIME_API_KEY
      }
    })
    .then(response=>{
      setTime(response.data);
      changebackground(weatherdata,response.data)
    })
    .catch(error=>{
      console.error("Error fetching time : ",error);
    })
  }

  useEffect(()=>{
    fetchData(city);
  },[])

  const handleSearch=()=>{
    setData(undefined)
    setTime(undefined)
    fetchData(city)
  }
  const unixToNormalTime=(unix)=>{
    const normalTime = new Date(unix * 1000);
    const hours = normalTime.getUTCHours().toString().padStart(2, '0');
    const minutes = normalTime.getUTCMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  

  const months=["January","February","March","April","May","June","July","August","September","October","November","December"]

  return (
    <>
    {/* Preloading weather images to avoid throttling */}
    <Image  src={`${drainy}`}/>
    <Image  src={`${nrainy}`}/>
    <Image  src={`${dclear}`}/>
    <Image  src={`${eclearncloudy}`}/>
    <Image  src={`${nclear}`}/>
    <Image  src={`${dcloudy}`}/>

      <Flex
      width="100vw"
      height={{base:"110vh",md:"100vh",lg:"100vh"}}
      justifyContent="center"
      position="relative"
      overflow="hidden"
      _before={{
        content: "''",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundImage: `url(${background})`,
        transition:"all 2s ease-in-out",
        backgroundSize: "cover",
        zIndex: -1,
      }}
    >
        <Stack color="#FFFFFF" gap="25px" alignItems="center" marginTop="5rem">
          <HStack alignItems="top">
            <Input
              value={city}
              maxWidth="300px"
              _focus={{ border: "2px solid white" }}
              onChange={(e)=>{setCity(e.target.value)}}
              onKeyDown={(e)=>{if(e.key==="Enter"){handleSearch()}}}
            />
            <Button padding="5px 15px" borderRadius="7px" border="1px solid white" onClick={handleSearch}>Search</Button>
          </HStack>
          { time?(
          <Box
            width={{base:"90vw",md:"70vw",lg:"600px"}}
            height="max-content"
            bgColor="#0000008f"
            padding={{base:"1.5rem",md:"1.5rem",lg:"2rem"}}
          >
            <HStack
              width="100%"
              justifyContent="space-around"
              alignItems="top"
            >
              <Stack
                flex="1"
                alignItems="center"
                justifyContent="space-around"
              > 
                {icon}
                {/* <Icon as={FiSun} fontSize={{base:"6rem",md:"6rem",lg:"7rem"}} margin="auto 0" /> */}
                <Text fontSize="18px" marginTop="auto" color="white">
                  {data.weather[0].description}
                </Text>
              </Stack>
              <Stack
                flex={{base:"1.5",md:"1","lg":"1"}}
              >
                <Stack>
                  <Text fontSize={{base:"2.5rem",md:"3rem",lg:"3.5rem"}}>{(time.hour%12||12)<10?("0"+time.hour%12||12):(time.hour%12||12)}:{time.minute} {Math.floor(time.hour/12)<1 ?("AM"):("PM")}</Text>
                  <Text fontSize="18px" paddingLeft="12px">
                   {months[time.month-1]} {time.day}, {time.year}
                  </Text>
                  <Text fontSize="18px" paddingLeft="12px">
                    {time.day_of_week}
                  </Text>
                </Stack>
                <HStack margin="auto 0 0 auto" fontSize="18px">
                  <Icon as={IoLocationSharp} />
                  <Text>{data.name}</Text>
                </HStack>
              </Stack>
            </HStack>
            <HStack marginTop="1rem" width="100%" justifyContent="space-around">
              <Text>Sunrise : {unixToNormalTime(data.sys.sunrise)}AM</Text>
              <Text>Sunset : {unixToNormalTime(data.sys.sunset)}PM</Text>
            </HStack>
            <Box width="95%" height="1.5px" bg="white" margin="12px auto"></Box>
            <HStack alignItems="top" flexWrap="wrap">
              <Stack flex="1" alignItems="center" minWidth={{base:"16rem",md:"14rem",lg:"10rem"}}>
                <Text fontSize="32px">{(data.main.temp - 273.15).toFixed(2)}</Text>
                <Text fontSize="18px">Temperature</Text>
                <Text>{`(°C)`}</Text>
              </Stack>
              <Box width={{base:"100%",md:"1.5px",lg:"1.5px"}} height={{base:"1px",md:"inherit",lg:"inherit"}} bg="white"></Box>
              <Stack flex="1" alignItems="center" minWidth={{base:"16rem",md:"14rem",lg:"10rem"}}>
                <Text fontSize="32px">{data.main.humidity}</Text>
                <Text fontSize="18px">Humidity</Text>
                <Text>
                  {`(g.m`}
                  <sup>-3</sup>
                  {`)`}
                </Text>
              </Stack>
              <Box width={{base:"100%",md:"100%",lg:"1.5px"}} height={{base:"1px",md:"1px",lg:"inherit"}} bg="white"></Box>
              <Stack flex="1" alignItems="center" minWidth={{base:"16rem",md:"14rem",lg:"10rem"}}>
                <Text fontSize="32px">{data.visibility}</Text>
                <Text fontSize="18px">Visibility</Text>
                <Text>{`(m)`}</Text>
              </Stack>
            </HStack>
          </Box>):(notFound?(<Box>City not Found</Box>):(<Box>Searching...</Box>))
          }
        </Stack>
      </Flex>
    </>
  );
}

export default App;
