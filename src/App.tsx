import React, { useState, useEffect } from 'react';
import './App.scss';
const Chart = require('chart.js/dist/chart.min.js');

const labels = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const backgroundColor = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];
const borderColor = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];

function App() {

  const [dados, setDados] = useState<any>(null);
  const [opcoes, setOpcoes] = useState<string[]>([]);
  const [selVal, setSelVal] = useState('');
  const [chart, setChart] =  useState<any>(null);

  useEffect(() => {
    (async () => {
      const url = 'https://indicators-dev.amicci-digital.com.br/api/briefing/by_retailer_and_year/get/';
      const request = await fetch(url);
      const resp = await request.json();
      if (resp) setDados(resp);
    })();

    const ctx = document.getElementById('myChart');
    const c = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Briefings by retailer',
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
          backgroundColor,
          borderColor,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }); 
    setChart(c);   
  },[]);


  useEffect(() => {
    if (dados) {
      const { briefings_count_by_retailer_and_year: {retailers} } = dados;
      if (retailers) {
        const arrKeys = Object.keys(retailers);
        const arrNames = arrKeys.map(k => retailers[k]['2021.0'].retailer_name);
        setOpcoes(arrNames);
      }
    }
  },[dados]);

  useEffect(() => {
    if (opcoes && opcoes.length) {
      setSelVal(opcoes[0])
    }
  },[opcoes]);

  useEffect(() => {
    if (selVal && dados) {
      const { briefings_count_by_retailer_and_year: {retailers} } = dados;
      if (retailers) {
        const arrKeys = Object.keys(retailers);
        const objKey = arrKeys.find(k => retailers[k]['2021.0'].retailer_name === selVal);
        if (objKey) {
          const values = labels.map(l => retailers[objKey]['2021.0'][l] || 0);
          if (chart) {
            chart.data.datasets.forEach((dataset:any) => {
              dataset.data = [...values];
            })
            chart.update();
          }
        }
      }    
    }
  },[dados,chart,selVal]);

  return (
    <div className="App">
      {opcoes && opcoes.length > 0 &&
      <select value={selVal} onChange={ev => setSelVal(ev.target.value)}>
        {opcoes.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>}
      <div className="areaChart">
        <canvas id="myChart" width="500" height="500"></canvas>
      </div>
    </div>
  );
}

export default App;
