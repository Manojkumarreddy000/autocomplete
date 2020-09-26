import React, { useState, useEffect } from "react";
import Autocomplete from 'react-autocomplete';
import axios from 'axios'
// import { useHistory } from 'react-router-dom';
import {Link} from "react-router-dom";
// import {Link,useLocation,withRouter,Redirect} from "react-router-dom";


function AutoComo(props) {

  
  useEffect(() => {
  },[])

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
      "_source":["HSCodeName","VariableName","VariablePath"],
      "query": {
      "bool": {
        "must":[
          {
          "query_string":{
              "fields": ["HSCode^3","HSName^2","HSCodeName^2","Country","VariableName^5","VariablePath","Level1","Level2","Level3","Level4","Level5"],
              "query": VariableName,
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

  return (
    // <div className={classes.root}>
    <div>
      <a href="/" >home</a>
      <br /><br /><br />
      
      <Autocomplete
            getItemValue={(item) => item.path}
            items={items}
            enderItem={(item, isHighlighted) =>
              <div className="searchDrop"  style={{background: isHighlighted ? 'lightgray' : 'black' }}>
                <Link to={`/${item.path}`}>
                 {item.label}
                </Link>
              </div>
            }
            value={value}
            onChange={(e) => {setVal(e.target.value);handleChange(e.target.value)}}
            renderMenu={(items) =>  <div style={divStyles} children={items}/>}

            
            // onSelect={(val) => {setVal(val);console.log("val",val)}}
        />
          
          
    </div>
  );
}


  
  function get_list_from_buckets(buckets){
    let economics_href = ""
    let demographics_href = ""
    let trade_export_href  = ""
    let trade_import_href  = ""  
    
    let list_bucket = buckets.map(item =>{
      let index = item._index
      // console.log(index)
      let href = ""
      let title = ""
      if(index === "economics_v102_test"){
        href = economics_href+item._source.Variablepath
        title = item._source.VariableName
      }
      if(index === "demographics_v1_test"){
        href = demographics_href+item._source.Variablepath
        title = item._source.VariableName
      }
      if(index === "trade_export_yearly_v1"){
        href = trade_export_href+item._source.Variablepath
        title = item._source.HSCodeName
      }
      if(index === "trade_import_yearly_v1"){
        href = trade_import_href+item._source.Variablepath
        title = item._source.HSCodeName
      }
      // console.log(index, title)
      return {index:index, title:title, href:href}
    })
    return list_bucket
  }



export default AutoComo ;