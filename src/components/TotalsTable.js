import React, {useEffect} from 'react';
import axios from 'axios';
import "../styles/foodDiary.css"
const TotalsTable = (props) => {
    const food = props.food;
    const date = props.date;
    const user = props.user;
    
    useEffect(() => {
        //function that will be called when the component is mounted and when we fetch Total objects from the database
        function updateTotals(date, allTotals, user) {
             
            //convert selected date into a different format
            let selectedDate = new Date(
             date.getFullYear(),
             date.getMonth(),
             date.getDate()
           ); 
         
           //filter totals by date and return an array of totals that are of the same date as the selected date
           let total = allTotals.filter((total) => {
             //filter every food by date
             let totalDate = new Date(total.date); //convert the MongoDB ISON date format into javascript date format
             var formattedTotalDate = new Date(
               totalDate.getFullYear(),
               totalDate.getMonth(),
               totalDate.getDate()
             ); 
             return formattedTotalDate.toString() === selectedDate.toString(); //returns array after formatting to string
            });

            //create a totalObject that we will return
            let totalObject = {
                id: '',
                calories: 0,
                protein: 0,
            }

             //if there is a total for the selected date, first store the total object's id in local storage
            if (total.length > 0) {
                localStorage.setItem("totalID", total[0]._id);
                //then update the total object that we will return to the component
                totalObject.id = total[0]._id;
                totalObject.calories = total[0].calories;
                totalObject.protein = total[0].protein;
            }else {
                createTotalIfDoesNotExist(date, user);
            }
          
            return totalObject;
         
        }
    
        //when the component mounts, we will fetch all totals from the database
        axios.get("http://localhost:5000/totals/user/" + user)
        .then((res) => {
          let allTotals = res.data;
          let totalsForToday = updateTotals(date, allTotals, user);

          //update the totals in the state using the passed in prop of setTotals
          props.setTotals(totalsForToday);
        })
        .catch((error) => console.log(error));
    }, [props, date, user, food]);

   
    //function that will create a total object if one does not exist for the selected date
    function createTotalIfDoesNotExist(date, user) {
        //if there is no total for the selected date, create one
        const total = {
            userID: user,
            calories: 0,
            protein: 0,
            date: date
        }
        //send the total object to the database
        axios.post("http://localhost:5000/totals/add", total).then((res) => {
            //after sending to the database, get the total id from the response
            const totalID = res.data._id;
            //store the total id in local storage
            localStorage.setItem("totalID", totalID);
        }).catch((error) => console.log(error));
    }

    return (
        //we use react fragments to return a list of elements instead of wrapping it into a parent div
        <React.Fragment>
            <tr >
            <td className="text-right text-lg font-bold">
            <div className="mr-3">Totals:</div>
            </td>
            {/* render total cals */}
            <td className="border border-white bg-gray-200 text-center font-bold text-green-600">{props.totalCalories}</td>
            {/* render total protein */}
            <td className="border border-white bg-gray-200 text-center font-bold text-green-600">{props.totalProtein}</td>
        </tr>
        <tr>
            <th className="w-8/12"></th>
            <th className="text-sm sm:text-base border border-white bg-blue-600 text-center text-white">
            Calories (kcal)
            </th>
            <th className="text-sm sm:text-base border border-white bg-blue-600 text-center text-white">
            Protein (g)
            </th>
        </tr>
        </React.Fragment>
    );
};

export default TotalsTable;