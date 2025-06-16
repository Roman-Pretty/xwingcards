export const tokenToLetterMap = {
  astromech: 'A',
  modification: 'm',
  missile: 'M',
  title: 't',
  torpedo: 'P',
  rotate: 'R',
  reload: '=',
  calculate: 'a',
  charge: 'g',
  lock: 'l',
  sl: '4',
  bl: '7',
  s: '8',
  br: '9',
  sr: '6',
  af: '{',
  ab: '}',
  crit: 'c',
  hit: 'd',
  focus: 'f',
  evade: 'e',
  pilot: 'x',
  talent: 'E',
  configuration: 'n',
  turret: 'U',
  bomb: 'B',
  gunner: 'Y',
  any: ')'
}

export const letterToTokenMap = Object.fromEntries(
  Object.entries(tokenToLetterMap).map(([k, v]) => [v, k])
);
