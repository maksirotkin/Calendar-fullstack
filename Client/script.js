
const calendar=document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),  
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay=document.querySelector(".event-day"),
    eventDate=document.querySelector(".event-date"),
    eventsContainer=document.querySelector(".events");
    addEventSubmit=document.querySelector(".add-event-btn");
    let today = new Date(); 
    let activeDay;
    let month=today.getMonth();
    let year=today.getFullYear();

    const months=[
        "січень", "лютий", "березень", 
        "квітень", "травень", "червень", "липень",
        "серпень", "вересень", "жовтень", "листопад", "грудень"
    ];

    let eventsArr=[];

    function initCalendar(){
        const firstDay = new Date(year, month, 1);   //2023 05 1
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const day = firstDay.getDay(); //день неділі
        const nextDays = 7 - lastDay.getDay() - 1;//день неділі 0 -це неділя
        //Дата на календарі 
        date.innerHTML=months[month] + " "+ year;   
    
        let days= "";
   
        for(let x = day; x > 1; x--)
        {
            //1-6 +1  = 4
            days+=`<div class="day prev-date" >${prevDays - x +2}</div>`; 
        } 

        for(let i = 1; i <= lastDate; i++)    
        {
            //chack event is on today
            let event = false;
            eventsArr.forEach((eventObj)=>{
                if(eventObj.day==i && eventObj.month==month+1 && eventObj.year==year)
                    {
                        event=true;
                    }
            });
            //if day is today add class today)
            if(
                i===new Date().getDate() &&
                year=== new Date().getFullYear() &&
                month=== new Date().getMonth()
            )
            {
                activeDay=i;
                getActiveDay(i);          
                updateEvents(i);
                if(event){
                    days+=`<div class="day today active event" >${i}</div>`;
                }
                else{
                    days+=`<div class="day today active" >${i}</div>`
                }
            }
            //add remaing as it is
            else{
                if(event){
                    days+=`<div class="day event" >${i}</div>`;
                }
                else{
                    days+=`<div class="day " >${i}</div>`
                }
                
            }
        }
        //next month days   Пн....Сб Нд   
        for(let j = 1; j <= nextDays + 1; j++)//next days= 6
        {
            days+=`<div class="day next-date" >${j}</div>`;
        }

        daysContainer.innerHTML=days;
        addListener();
    }
    //initCalendar();
    

    //prev month
    function prevMonth()
    {
        month--;
        if(month<0)
        {
            month=11;
            year--;
        }
        initCalendar();
    }


    //next month
    function nextMonth()
    {
        month++;
        if(month>11)
        {
            month=0;
            year++;
        }
        initCalendar();
      }

    prev.addEventListener("click", prevMonth);
    next.addEventListener("click", nextMonth);
    initCalendar();

    //////////////////////////////////////////////////////////////////////////////////////


//go to date and go to today
todayBtn.addEventListener("click", ()=>{
    today=new Date();
    month=today.getMonth();
    year=today.getFullYear();
    initCalendar();
});


dateInput.addEventListener("input", (e)=>{
    //only numbers remove anything
    dateInput.value = dateInput.value.replace(/[^0-9/]/g,"");
    if(dateInput.value.length===2){
        //add slash
        dateInput.value+="/";
    }
    if (dateInput.value.length > 7)
    {
        //dont allow more then 7 characters
        dateInput.value=dateInput.value.slice(0,7)
    }
    //if backspace pressed
   if(e.inputType==="deleteContentBackward")
   {
        if(dateInput.value.length===3){
            dateInput.value=dateInput.value.slice(0,2);
        }
   }
});
gotoBtn.addEventListener("click",gotoDate);

function gotoDate(){
    console.log("here");
    const dateArr = dateInput.value.split("/");
    if(dateArr.length===2){
        if(dateArr[0]>0 && dateArr[0]<13 && dateArr[1].length===4){
            month=dateArr[0]-1;
            year=dateArr[1];
            initCalendar();
            return;
        }
    }
    alert("Неввірна дата")
}





const addEventBtn=document.querySelector(".add-event"),
 addEventContainer=document.querySelector(".add-event-wrapper"),
 addEventCloseBtn=document.querySelector(".close");
 addEventTitle=document.querySelector(".event-name");
 addEventFrom=document.querySelector(".event-time-from");
 addEventTo=document.querySelector(".event-time-to");

addEventBtn.addEventListener("click",()=>{
    addEventContainer.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click",()=>{
    addEventContainer.classList.remove("active");
});
document.addEventListener("click", (e)=>{
    //if click outside
    if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) 
    {
        addEventContainer.classList.remove("active");
    }
}
);


//alow only 50 chars in title
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
  });

  //allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");

  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  //не більше 5 знакаів
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});
addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});


//function to add listener on days

function addListener(){
    const days=document.querySelectorAll(".day");
    days.forEach(day=>{
        day.addEventListener("click",(e)=>{

            //set current day as active
            activeDay=Number(e.target.innerHTML);

            //call active day after click
            getActiveDay(e.target.innerHTML);
            updateEvents(Number( e.target.innerHTML));

            //remove active ftom alredy active
            days.forEach((day)=>{
                day.classList.remove("active");
            });


            //if prev m day click go to prv month
            if(e.target.classList.contains("prev-date")){
                prevMonth();
                setTimeout(()=>{
                    //select all days of month
                    const days=document.querySelectorAll(".day");
                    //after going to prev month add active to clicked
                    days.forEach((day)=>{
                        if(!day.classList.contains("prev-date")&& day.innerHTML==e.target.innerHTML)
                        {
                            day.classList.add("active");
                        }
                    });
                },100);


                //next month days
            }else if(e.target.classList.contains("next-date")){
                nextMonth();
                setTimeout(()=>{
                    //select all days of month
                    const days=document.querySelectorAll(".day");
                    //after going to next month add active to clicked
                    days.forEach((day)=>{
                        if(!day.classList.contains("next-date")&& day.innerHTML==e.target.innerHTML)
                        {
                            day.classList.add("active");
                        }
                    });
                },100);
            }

            else {
                //add active to date
                e.target.classList.add("active");
            }

        });
    })
}
//show active day events

function getActiveDay(date){
    const day =new Date(year,month,date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML= dayName;
    eventDate.innerHTML=date+" "+ months[month]+" "+year;

}

//function to show events on that day
function updateEvents(date){
    let events = "";
    eventsArr.forEach((event)=>{
        if(//active day
            date === event.day && 
            month + 1 === event.month &&
            year === event.year
        ){
            //show event
            event.events.forEach((event)=>{
                events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>
        `;
            });
        }
    });

    //if nothing found
    if(events===""){
        events = `<div class="no-event">
        <h3>Немає подій</h3>
    </div>`;
    }
    console.log(events);
    eventsContainer.innerHTML = events;
    

}

//function to add Events/
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
      alert("Please fill all the fields");
      return;
    }
  
    //check correct time format 24 hour
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
    ) {
      alert("Invalid Time Format");
      return;
    }
  
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);
   
  
    //check if event is already added
    let eventExist = false;
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.forEach((event) => {
          if (event.title === eventTitle) {
            eventExist = true;
          }
        });
      }
    });
    if (eventExist) {
      alert("Event already added");
      return;
    }
    const newEvent = {
      title: eventTitle,
      time: timeFrom + " - " + timeTo,
    };
    console.log(newEvent);
    console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
      eventsArr.forEach((item) => {
        if (
          item.day === activeDay &&
          item.month === month + 1 &&
          item.year === year
        ) {
          item.events.push(newEvent);
          eventAdded = true;
        }
      });
    }
  //пусто то робимо нове
    if (!eventAdded) {
      eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        events: [newEvent],
      });
    }
  
    //Відображення в консолі
    console.log(eventsArr);

    addEventContainer.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);
    //select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }
  });

  function convertTime(time) {
    //convert time to 24 hour format
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    //let timeFormat = timeHour >= 12 ? "PM" : "AM";
    //timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin; //+ " " + timeFormat;
    return time;
  }
  //function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
      if (confirm("Ви впевнені що хочете видалити подію?")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;
        //title події і пошук його в масиві
        eventsArr.forEach((event) => {
          if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
          ) {
            event.events.forEach((item, index) => {
              if (item.title === eventTitle) {
                event.events.splice(index, 1);
              }
            });
            //if no events left in a day then remove that day from eventsArr
            if (event.events.length === 0) {
              eventsArr.splice(eventsArr.indexOf(event), 1);
              //remove event class from day
              const activeDayEl = document.querySelector(".day.active");
              if (activeDayEl.classList.contains("event")) {
                activeDayEl.classList.remove("event");
              }
            }
          }
        });
        updateEvents(activeDay);
      }
    }
  });


  document.getElementById('RegistrationSubmit').addEventListener('click', function(event) {
    event.preventDefault(); // Зупинити стандартну поведінку форми
  
    let username = document.getElementById('registerUsername').value;
    let password = document.getElementById('registerPassword').value;
  
    Registration(username, password)
  });
  

  // Функція для реєстрації
  function Registration(username, password) {
    const reg = JSON.stringify({ username, password });
    fetch('/registration', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reg,
    })
      .then(response => response.json())
      .then(data => {
        if (data !== `Помилка при Реєстрації` && data !==`Користувач з таким ім'ям вже існує`) {
          //console.log('Ви увійшли до бази даних:', log);
          alert(data);
      }else
      {
         alert(data);
      Login(username,password)
      
      }
      var loginModal = document.getElementById('loginModal');
      var modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      document.body.classList.remove('modal-open');
      loginModal.classList.remove('show');
      modalBackdrop.classList.remove('show');
      
      
      })
      .catch(error => {
        console.log('Сталася помилка при реєстрації:', error);
      });
  }


  document.getElementById('loginSubmit').addEventListener('click', function(event) {
    event.preventDefault(); // Зупинити стандартну поведінку форми
  
    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;
  
    Login(username, password);
  });
  
  // Функція для входу
  function Login(username, password) {
    const log = JSON.stringify({ username, password });
    fetch('/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: log,
    })
      .then(response => response.json())
      .then(data => {
        // if(data!=`Введений пароль невірний`){
        // console.log('Ви увійшли до бази даних:', log);
        // alert(`Успішний вхід!${data}`);
        // getEvents();
        if (data !== `Введений пароль невірний` && data !==`Користувач не знайдений`) {
          console.log('Ви увійшли до бази даних:', log);
          alert(data);
          getEvents();
      
      }else{
      alert(`Невийшло:${data}`);
      }
        var loginModal = document.getElementById('loginModal');
      var modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      document.body.classList.remove('modal-open');
      document.body.classList.add('styless');
      loginModal.classList.remove('show');
      modalBackdrop.classList.remove('show');

      })
      .catch(error => {
        console.log('Сталася помилка при надсиланні події:', error);
      });
  }

function getEvents() {
fetch('/events')
.then(  response => response.json())
.then(data => {
    if (!data) {
      console.log(`${data}`);
      return;
    }else{
    eventsArr = eventsArr.concat(data);
    }
  });
}

document.getElementById('SaveEventsbtn').addEventListener('click', ()=>{
  //event.preventDefault();

  saveEventsToDb();
  getEvents();
});

function saveEventsToDb() {
    const eventJSON = JSON.stringify(eventsArr);
    fetch('/addEvents', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: eventJSON,
    })
      .then(response => response.json())
      .then(data => {
        if (data !== `Поточний користувач невідомий` ) {    
          alert(data);
      
      }else{
        alert(data);
      }
        
        //eventsArr = []; // Очищуємо масив подій після успішного збереження

      // console.log('Події успішно збережено в базі даних:', eventJSON);
      // alert('Події успішно збережено в базі даних');
      })
      .catch(error => {
        console.error('Сталася помилка при SaveEvent', error);
      });
    
}
  function getUser() {
    fetch('/user')
    .then(  response => response.json())
    .then(data => {
        if (!data) {
          console.log(`data==null${data}`);
          return;
        }else{
          console.log(`Get User done   ${data.username}`);
        }
        return data.username;
      });
    }



