import { useEffect, useMemo, useState } from "react";

import {
  Search,
  X,
  Sparkles,
  Mic,
  MicOff,
} from "lucide-react";


function ServiceSearch({

  searchTerm,

  setSearchTerm,

  services = [],

  onSelectSuggestion,

}) {


  const [isListening, setIsListening] =
    useState(false);


  const [voiceSupported, setVoiceSupported] =
    useState(false);



  /*
  |--------------------------------------------------------------------------
  | CHECK VOICE SUPPORT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    setVoiceSupported(
      Boolean(SpeechRecognition)
    );


  }, []);



  /*
  |--------------------------------------------------------------------------
  | NATURAL LANGUAGE INTENTS
  |--------------------------------------------------------------------------
  */

  const intentKeywords = {

    "AC Repair": [

      "ac",
      "air conditioner",
      "cooling",
      "not cooling",
      "ac repair",
      "ac service",
      "cooler",

    ],


    Plumbing: [

      "plumber",
      "plumbing",
      "pipe",
      "leak",
      "leaking",
      "tap",
      "sink",
      "drain",
      "water",

    ],


    Electrical: [

      "electrician",
      "electrical",
      "fan",
      "light",
      "switch",
      "socket",
      "wire",

    ],


    Cleaning: [

      "clean",
      "cleaning",
      "dirty",
      "deep cleaning",
      "house cleaning",

    ],


    Carpentry: [

      "carpenter",
      "furniture",
      "wood",
      "door",

    ],


    Painting: [

      "paint",
      "painting",
      "wall",
      "color",

    ],


  };



  const normalizeText = (text) => {

    return String(text || "")

      .toLowerCase()

      .replace(/[^\w\s]/g, " ")

      .replace(/\s+/g, " ")

      .trim();

  };




  const detectIntent = (query) => {


    const normalizedQuery =
      normalizeText(query);


    const result = [];



    Object.entries(intentKeywords)

      .forEach(

        ([category, keywords]) => {


          let score = 0;



          keywords.forEach(
            (keyword)=>{


              if(
                normalizedQuery.includes(
                  normalizeText(keyword)
                )
              ){

                score += 2;

              }


            }
          );



          if(score > 0){

            result.push({

              category,

              score,

            });

          }


        }

      );



    return result.sort(
      (a,b)=>b.score-a.score
    );

  };





  /*
  |--------------------------------------------------------------------------
  | VOICE SEARCH
  |--------------------------------------------------------------------------
  */


  const startVoiceSearch = ()=>{


    const SpeechRecognition =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;



    if(!SpeechRecognition){

      alert(
        "Voice search is not supported"
      );

      return;

    }



    const recognition =
      new SpeechRecognition();



    recognition.lang =
      "en-IN";


    recognition.continuous =
      false;


    recognition.interimResults =
      false;



    setIsListening(true);



    recognition.onresult =
      (event)=>{


        const text =
          event.results[0][0]
          .transcript;


        setSearchTerm(text);


      };



    recognition.onerror =
      ()=>{


        setIsListening(false);


      };



    recognition.onend =
      ()=>{


        setIsListening(false);


      };



    recognition.start();


  };





  /*
  |--------------------------------------------------------------------------
  | SMART SUGGESTIONS
  |--------------------------------------------------------------------------
  */


  const suggestions = useMemo(()=>{


    const search =
      normalizeText(searchTerm);



    if(!search){

      return [];

    }



    const intents =
      detectIntent(search);



    return services

      .map(service=>{


        let score = 0;



        const title =
          normalizeText(service.title);


        const category =
          normalizeText(service.category);



        const description =
          normalizeText(
            service.description
          );



        if(title.includes(search))

          score += 50;



        if(category.includes(search))

          score += 40;



        if(description.includes(search))

          score += 20;



        intents.forEach(intent=>{


          if(
            normalizeText(
              intent.category
            )
            === category
          ){

            score +=
              intent.score * 20;

          }


        });



        return {

          service,

          score,

        };



      })


      .filter(
        item=>item.score>0
      )


      .sort(
        (a,b)=>b.score-a.score
      )


      .slice(0,6)


      .map(
        item=>item.service
      );



  },[

    services,

    searchTerm

  ]);






  return (

    <div className="service-search-wrapper">


      <Search

        size={20}

        className="search-icon"

      />



      <input


        type="text"


        value={searchTerm}


        onChange={(e)=>

          setSearchTerm(
            e.target.value
          )

        }


        placeholder={

          isListening

          ?

          "Listening..."

          :

          "Search for a service..."

        }


      />



      {
        voiceSupported &&

        (

          <button

            type="button"

            className={

              isListening

              ?

              "voice-search-btn listening"

              :

              "voice-search-btn"

            }


            onClick={
              startVoiceSearch
            }


          >


            {

              isListening

              ?

              <MicOff size={18}/>

              :

              <Mic size={18}/>

            }


          </button>

        )

      }






      {
        searchTerm &&

        (

        <button

          type="button"

          className="clear-search"

          onClick={()=>
            setSearchTerm("")
          }

        >

          <X size={16}/>

        </button>

        )

      }




      {

        searchTerm.trim() &&

        suggestions.length > 0 &&

        (

        <div className="service-search-suggestions">


          <div className="suggestions-heading">

            Smart service matches

          </div>



          {

          suggestions.map(service=>(


            <button

              key={service.id}

              type="button"

              className="service-suggestion"


              onClick={()=>{

                onSelectSuggestion

                ?

                onSelectSuggestion(service)

                :

                setSearchTerm(
                  service.title
                )

              }}


            >


              <span className="suggestion-icon">

                <Sparkles size={17}/>

              </span>



              <span className="suggestion-content">


                <strong>

                  {service.title}

                </strong>



                <small>

                  {service.category}

                </small>



              </span>


            </button>


          ))

          }



        </div>

        )

      }


    </div>

  );


}


export default ServiceSearch;