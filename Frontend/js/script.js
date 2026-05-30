AOS.init({
  duration:1200
});

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

  counter.innerText = '0';

  const updateCounter = () => {

    const target = +counter.getAttribute('data-target');

    const c = +counter.innerText;

    const increment = target / 100;

    if(c < target){

      counter.innerText = `${Math.ceil(c + increment)}`;

      setTimeout(updateCounter,20);

    }else{

      counter.innerText = target;

    }

  };

  updateCounter();

});
const form = document.getElementById('foodForm');

form.addEventListener('submit', async(e)=>{

    e.preventDefault();

    const formData = new FormData(form);

    const data = Object.fromEntries(formData);

    const response = await fetch('http://localhost:5000/api/food/submit', {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify(data)

    });
    const result = await response.json();

    alert(`Food classified as ${result.result.classification}`);

});