import React, { useState, useEffect } from "react";
import Autocomplete from 'react-autocomplete';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import {Link} from "react-router-dom";
import useWindowD from "./useWindow";
// import {Link,useLocation,withRouter,Redirect} from "react-router-dom";


function AutoComo(props) {

  
  useEffect(() => {
  },[])
  
  const history = useHistory();
  const [value,setVal] = useState("")
  const [items,setItems] = useState([])

  
  // var value = ""

  function handleChange(VariableName){
    setItems([]);
    if(VariableName === ""){
      
      return
    }
  
    var url = 'https://elastic.airesearch.in/economics_v102_test,demographics_v1_test,trade_export_yearly_v1,trade_import_yearly_v1/_search'
          
  var query4 = {   
      "_source":["HSCodeName","HSCode", "Country","VariableName","VariablePath","State","Level1","Level2"],
      "query": {
      "bool": {
        "must":[
          {
          "query_string":{
              "fields": ["HSCode^3","HSName^2","HSCodeName^2","Country","VariableName^5","VariablePath","Level1","Level2","Level3","Level4","Level5"],
              "query": VariableName+"*",
              "minimum_should_match": 1
            }
          }
        ]
      }
    }
  }
    
          
            
            
  axios.post(url, query4)
    .then( d => {
      if(d.status === 200 ){
        console.log(d.data);
        let total_data = d.data.hits.hits

        let list = get_list_from_buckets(total_data)
        console.log(list)
        setItems(list)
      }
      else{
        console.log("err")
      }
    })
    .catch( error => {
      if (error) {
        console.log(error)
      }
      else{
        console.log("Error!");
      }
    });

}

  // const classes = useStyles();
  const divStyles = {
    left: "0px",
    top: "50px",
    height:"100%",
    overflow:"auto",
    backgroundColor:"whitesmoke",
  }

const {width,height}=useWindowD()
  var Width
  if(width>=1300)
    Width=800
  else if(width>=1023)
    Width=524
  else
    Width=width-152;
  return (
    <div className="search">
       <Autocomplete

      renderInput={(params) => (
        <input id = "myInput" type="text" {...params} className="searchTerm" placeholder="Search " style={{width:Width}} /> 
      )}

      getItemValue={(item) => item.href}
      items={items}
      renderItem={(item, isHighlighted) =>
        <div className="searchDrop"  style={{padding:"0.5rem 1rem",fontSize:"0.85rem",background: isHighlighted ? 'rgba(49,53,61,0.75)' : 'white',width:Width,backgroundColor:"white"}}>
        
          <Link to={`/${item.href}`}>
            {item.title}
          </Link>
        </div>
      }
      value={value}
      onChange={(e) => {setVal(e.target.value);handleChange(e.target.value)}}
      renderMenu={(items) =>  <div style={divStyles} children={items}/>}


      />
      <div id="butt">
           <button id = "myBtn" type="submit" className="searchButton" onClick={(e) => {
             if(items.length !== 0){
            history.push(items[0].path)
             }
            }
             }>
             <i className="fa fa-search"></i>
          </button>
          </div>
    </div>
)
  // return (
  //   // <div className={classes.root}>
  //   <div>
  //     <a href="/" >home</a>
  //     <br /><br /><br />
      
  //     <Autocomplete
  //           getItemValue={(item) => item.path}
  //           items={items}
  //           enderItem={(item, isHighlighted) =>
  //             <div className="searchDrop"  style={{background: isHighlighted ? 'lightgray' : 'black' }}>
  //               <Link to={`/${item.path}`}>
  //                {item.label}
  //               </Link>
  //             </div>
  //           }
  //           value={value}
  //           onChange={(e) => {setVal(e.target.value);handleChange(e.target.value)}}
  //           renderMenu={(items) =>  <div style={divStyles} children={items}/>}

            
  //           // onSelect={(val) => {setVal(val);console.log("val",val)}}
  //       />
          
          
  //   </div>
  // );
}


  
function get_list_from_buckets(buckets){
  let economics_href = "https://economics.airesearch.in/"
  let demographics_href = "https://demographics.airesearch.in/Demographics/"
  let trade_href  = "https://trade.airesearch.in/trade/"
  
  let list_bucket = buckets.map(item =>{
    let index = item._index
    // console.log(index)
    let href = ""
    let title = ""
    // console.log(item._source)

    if(index === "economics_v102_test"){
      // href = economics_href+item._source["VariablePath"]
      href = economics_href + item._source["VariablePath"]
      title = item._source["VariableName"]+","+item._source["Level1"]+","+item._source["Level2"]+","+item._source["Level4"]+","+item._source["Level3"]
    }
    if(index === "demographics_v1_test"){
      // href = demographics_href+item._source["Variablepath"]
      href = demographics_href + item._source["Variablepath"]
      title = item._source["VariableName"]+","+item._source["State"]+","+item._source["Level1"]+","+item._source["Level2"]
    }
    if(index === "trade_export_yearly_v1"){
      // href = trade_href+item._source.Variablepath
      href = trade_href+item._source["Country"]+"/"+item._source["HSCode"]
      title = item._source["Country"]+","+item._source["HSCode"]+"," + item._source["HSCodeName"]
    }
    if(index === "trade_import_yearly_v1"){
      // href = trade_href+item._source.Variablepath
      href = trade_href+item._source["Country"]+"/"+item._source["HSCode"]
      title = item._source["Country"]+","+item._source["HSCode"]+"," + item._source["HSCodeName"]
    }
    // console.log(index, title)
    return {index:index, title:title, href:href}
  })
  return list_bucket
}



export default AutoComo ;