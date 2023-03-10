var game = require('./game');

stattracker:function(){
  
  let totalTransforms = parseInt(localStorage.getItem("total_transforms")) || 0;
  totalTransforms += parseInt(game.stats.transforms) || 0;
  localStorage.setItem("total_transforms", totalTransforms.toString());
  console.log(`New total_transforms value: ${totalTransforms}`);

  let totalSeconds = parseInt(localStorage.getItem("total_seconds")) || 0;
  totalTransforms += parseInt(time) || 0;
  localStorage.setItem("total_seconds", totalSeconds.toString());
  console.log(`New total_seconds value: ${totalSeconds}`);

  let totalRestarts = parseInt(localStorage.getItem("total_restarts")) || 0;
  totalTransforms += parseInt(game.stats.restarts) || 0;
  localStorage.setItem("total_restarts", totalRestarts.toString());
  console.log(`New total_restarts value: ${totalRestarts}`);

  let totalDeaths = parseInt(localStorage.getItem("total_deaths")) || 0;
  totalTransforms += parseInt(game.stats.deaths) || 0;
  localStorage.setItem("total_deaths", totalDeaths.toString());
  console.log(`New total_deaths value: ${totalDeaths}`);
  
}