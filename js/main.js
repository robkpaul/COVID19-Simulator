
class Simulation {
  constructor() {
    this.personMap = [];
    let simContainer = document.querySelector('.simulation-container');
    simContainer.innerHTML = '';
    for (var i = 0; i < 10; i++) {
      simContainer.innerHTML += `<div class="row row-${i}"></div>`;
      let rowContainer = document.querySelector(`.row-${i}`);
      this.personMap.push([]);
      for (var j = 0; j < 10; j++) {
        rowContainer.innerHTML += `<div class="ppl pos${i}${j}">•</div>`;
        this.personMap[i].push(new Person(i, j));
      }
    }
  }

  startSim() {
    let infectedX = Math.floor(Math.random()*10);
    let infectedY = Math.floor(Math.random()*10);
    this.personMap[infectedX][infectedY].state = 1;
    intervalID = document.defaultView.setInterval(this.doDay, 125, this.personMap);
  }

  doDay(map) {
    day++;
    document.querySelector('.day-counter').innerHTML = `Day ${day}`;
    for (var row of map) {
      for (var pers of row) {
        pers.doDay(map);
      }
    }
  }
}

class Person {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.state = 0; //0 - healthy, 1 - carrier, 2 - sick/symptomatic, 3 - dead, 4 - immune/recovered
    this.daysSinceStatusChange = 0;
  }

  setState(newState){
    this.state = newState;
  }

  doDay(map) {
    if(this.state == 1) { //carrier
      this.daysSinceStatusChange++;
      if(Math.floor(Math.random()*this.daysSinceStatusChange) > 3 || this.daysSinceStatusChange == 14) {
        this.daysSinceStatusChange = 0;
        this.state = 2;
        for (let r = r0; 0 < r;) {
          if(r>=1 || Math.random() > r){
            let coords = this.generateInfectCoords();
            let infectX = coords[0];
            let infectY = coords[1];
            if(map[infectX][infectY].state == 0){
              map[infectX][infectY].setState(1);
            }
          }
          r--
        }
      }
    }
    else if(this.state == 2){
      if(this.daysSinceStatusChange == 0){
        document.querySelector(`.pos${this.x}${this.y}`).style.color = "red";
      }
      this.daysSinceStatusChange++;
      if(Math.floor(Math.random()*this.daysSinceStatusChange) > 6 || this.daysSinceStatusChange == 20){
        if(Math.floor(Math.random()*100) < 4) {
          this.state = 3;
          document.querySelector(`.pos${this.x}${this.y}`).style.color = "gray";
        }
        else {
          this.state = 4;
          document.querySelector(`.pos${this.x}${this.y}`).style.color = "cyan";
        }
      }
    }
  }

  generateInfectCoords(){
    let infectedX = Math.floor(Math.random()*3)-1;
    let infectedY = Math.floor(Math.random()*3)-1;
    if(infectedX + this.x > 9){
      infectedX--
    }
    else if (infectedX + this.x < 0) {
      infectedX++;
    }
    if(infectedY + this.y > 9){
      infectedY--;
    }
    else if (infectedY + this.y < 0) {
      infectedY++;
    }
    if(infectedX == infectedY && infectedX == 0) {
      if(Math.floor(Math.random()*2) == 1) {
        if(this.x == 9){
          infectedX--
        }
        else {
          infectedX++;
        }
      }
      else {
        if(this.y == 9){
          infectedY--;
        }
        else {
          infectedY++;
        }
      }
    }
    return [infectedX+this.x, infectedY+this.y]
  }
}

let day = 0;
let r0 = document.querySelector('.r0-input').value;
let intervalID = null;
let stateOfButton = 'start'

document.querySelector('.start-button').addEventListener('click', () => {
  if(stateOfButton === 'start') {
    day = 0;
    r0 = document.querySelector('.r0-input').value;
    new Simulation().startSim();
    stateOfButton = 'stop'
    document.querySelector('.start-button').innerHTML = 'Stop';
  }
  else {
    document.defaultView.clearInterval(intervalID);
    stateOfButton = 'start'
    document.querySelector('.start-button').innerHTML = 'Restart';
  }
});
