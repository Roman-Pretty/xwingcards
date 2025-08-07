// Card data loader - combines all card type files into a single array
import ace from "./cards/ace.json";
import astromech from "./cards/astromech.json";
import cannon from "./cards/cannon.json";
import configuration from "./cards/configuration.json";
import crew from "./cards/crew.json";
import force from "./cards/force.json";
import gunner from "./cards/gunner.json";
import illicit from "./cards/illicit.json";
import missile from "./cards/missile.json";
import modification from "./cards/modification.json";
import payload from "./cards/payload.json";
import sensitive from "./cards/sensitive.json";
import sensor from "./cards/sensor.json";
import tactical from "./cards/tactical.json";
import talent from "./cards/talent.json";
import tech from "./cards/tech.json";
import title from "./cards/title.json";
import torpedo from "./cards/torpedo.json";
import turret from "./cards/turret.json";

// Combine all card arrays into one
const cards = [
  ...ace,
  ...astromech,
  ...cannon,
  ...configuration,
  ...crew,
  ...force,
  ...illicit,
  ...gunner,
  ...missile,
  ...modification,
  ...payload,
  ...sensitive,
  ...sensor,
  ...tactical,
  ...talent,
  ...tech,
  ...title,
  ...torpedo,
  ...turret,
];

export default cards;

// Also export individual card types for more granular access if needed
export {
  ace,
  astromech,
  cannon,
  configuration,
  crew,
  force,
  illicit,
  gunner,
  missile,
  modification,
  payload,
  sensitive,
  sensor,
  tactical,
  talent,
  tech,
  title,
  torpedo,
  turret,
};
