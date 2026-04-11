// Arduino button press — sensorIndex (0/1/2) maps to option position
subscribe("pedestal1", ({ sensorIndex, isActive }) => {
  if (isActive) game.registerChoice(0, positionToOption(sensorIndex));
});
subscribe("pedestal2", ({ sensorIndex, isActive }) => {
  if (isActive) game.registerChoice(1, positionToOption(sensorIndex));
});
subscribe("pedestal3", ({ sensorIndex, isActive }) => {
  if (isActive) game.registerChoice(2, positionToOption(sensorIndex));
});
subscribe("pedestal4", ({ sensorIndex, isActive }) => {
  if (isActive) game.registerChoice(3, positionToOption(sensorIndex));
});

// RFID — same as before
[0, 1, 2, 3].forEach((pedestalIndex) => {
  subscribe(`rfid${pedestalIndex + 1}`, ({ rfidTag }) => {
    const species = RFID_MAP[rfidTag];
    if (!species) {
      console.warn(`⚠️ Unknown RFID tag: ${rfidTag}`);
      return;
    }
    game.assignCharacterToPedestal(pedestalIndex, species);
    console.log(`🪪 RFID: pedestal ${pedestalIndex + 1} → ${species}`);
    io.emit("lobby", getLobbyState());
    tryStartGame();
  });
});
