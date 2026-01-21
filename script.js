const screens = {
  splash: document.getElementById("splash"),
  auth: document.getElementById("auth"),
  home: document.getElementById("home"),
};

const missionsData = [
  { text: "Ler 10 minutos", xp: 20 },
  { text: "Alongar por 5 minutos", xp: 15 },
  { text: "Ficar 30 min sem celular", xp: 25 },
  { text: "Treinar ou caminhar", xp: 30 },
];

let user = JSON.parse(localStorage.getItem("nimbusUser"));

function show(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screen].classList.add("active");
}

setTimeout(() => {
  if (user) show("home");
  else show("auth");
  render();
}, 1200);

function login() {
  const name = document.getElementById("username").value;
  if (!name) return;

  user = {
    name,
    level: 1,
    totalXp: 0,
    currentXp: 0,
    xpToNext: 100,
    days: 0,
  };

  save();
  show("home");
  render();
}

function calculateXpToNext(level) {
  return 100 + (level - 1) * 50;
}

function completeMission(xp) {
  user.totalXp += xp;
  user.currentXp += xp;

  while (user.currentXp >= user.xpToNext) {
    user.currentXp -= user.xpToNext;
    user.level++;
    user.xpToNext = calculateXpToNext(user.level);
  }

  user.days = Math.min(30, user.days + 1);
  save();
  render();
}

function render() {
  if (!user) return;

  document.getElementById("userName").innerText = user.name;
  document.getElementById("levelInfo").innerText =
    `Lv ${user.level} • ${user.currentXp}/${user.xpToNext} XP`;

  document.getElementById("cycleProgress").innerText =
    `${user.days} / 30 dias`;

  document.getElementById("barFill").style.width =
    `${(user.days / 30) * 100}%`;

  const missions = document.getElementById("missions");
  missions.innerHTML = "";

  missionsData.forEach(m => {
    const div = document.createElement("div");
    div.className = "mission";
    div.innerHTML = `
      <span>${m.text}</span>
      <button onclick="completeMission(${m.xp})">+${m.xp} XP</button>
    `;
    missions.appendChild(div);
  });
}

function save() {
  localStorage.setItem("nimbusUser", JSON.stringify(user));
}

function reset() {
  if (confirm("Resetar progresso?")) {
    localStorage.removeItem("nimbusUser");
    location.reload();
  }
}
