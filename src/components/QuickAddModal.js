import React, { useState } from "react";
import axios from "axios";
import '../styles/foodDiary.css';

//modal below is a component from tailwind css
export default function QuickAddModal(props) {
  const [showModal, setShowModal] = useState(false);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  
  function onSubmit(e) {
    e.preventDefault();
    const newTotalCalories = props.totalCalories + parseInt(calories);
    const newTotalProtein = props.totalProtein + parseInt(protein);

    //create a total object with the new total calories and protein
    let totalObject = {
      calories: newTotalCalories,
      protein: newTotalProtein
    }; 

    //update the total object in the database with the new total object
    axios.post("http://localhost:5000/totals/update/" + localStorage.getItem('totalID'), totalObject)
          .catch((error) => console.log(error));
    
    //the props contain the setTotal hook that updates the totals so we will use that to update the totals
    props.setTotals({ calories: newTotalCalories, protein: newTotalProtein });

    //reset the states
    setCalories(0);
    setProtein(0);
    //hide the modal
    setShowModal(false);
  }
  
  return (
    <>
    {/* div below is the quick add button on main page */}
      <div className="smaller-text text-sm sm:text-base inline-block cursor-pointer ml-2 text-blue-600 font-semibold"  onClick={() => setShowModal(true)}>Quick Add</div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-4/5 my-6 mx-auto sm:w-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-4 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Quick Add
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto mx-7">
                
                {/* form below is the form for quick add */}
                <form className="sm:w-80" onSubmit={(e) => onSubmit(e)}>
         
                    <div className="form-group mt-2 flex justify-between items-center">
                      <label className="text-lg sm:text-xl">Calories: </label>
                      <input 
                          type="number" 
                          min="0"
                          className="form-control quick-add-input"
                          value={calories}
                          onChange={e => setCalories(e.target.value)}
                          />
                    </div>
                    <div className="form-group mt-2 flex justify-between items-center">
                      <label className="text-lg sm:text-xl">Protein: </label>
                      <input 
                          type="number" 
                          min="0"
                          className="form-control quick-add-input"
                          value={protein}
                          onChange={e => setProtein(e.target.value)}
                          />
                    </div>

                </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setCalories(0)
                      setProtein(0)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => onSubmit(e)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}