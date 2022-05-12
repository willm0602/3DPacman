import Ghost from "./Ghost.mjs";
import Player from "./Player.mjs";
import Gate from "./Gate.mjs";

export function RandomMovement(
  ghost = new Ghost(0xfff, 0, 0),
  otherGhosts = [new Ghost(0xfff, 0, 0)],
  player = new Player(),
  gates = [new Gate(0, 0, 0, 0)]
) {
  //all places the ghost can move to regardless of a ghosts obstacles
  const allDirections = () => {
    let x = ghost.x;
    let z = ghost.z;

    return [
      [x - 1, z],
      [x + 1, z],
      [x, z - 1],
      [x, z + 1],
    ];
  };

  const pointIntersectsGates = (
    point = [0, 0],
    gate = new Gate(0, 0, 0, 0)
  ) => {
    let lX = Math.min(gate.x1, gate.x2);
    let rX = Math.max(gate.x1, gate.x2);
    let lZ = Math.min(gate.z1, gate.z2);
    let rZ = Math.max(gate.z1, gate.z2);
    let [x, z] = point;
    return lX <= x && x <= rX && lZ <= z && z <= rZ;
  };

  //everywhere the ghost could adjacently move to
  const getPossibleMoves = () => {
    let possibleDirections = allDirections().filter(([x, z]) => {
      for (let gate of gates) {
        if (pointIntersectsGates([x, z], gate)) return false;
      }

      for (let otherGhost of otherGhosts) {
        if (x == otherGhost.x && z == otherGhost.z) {
          return false;
        }
      }
      return true;
    });

    return possibleDirections;
  };

  const getBestMove = () => {
    let possibleMoves = getPossibleMoves();
    if (possibleMoves.length == 0) return [ghost.x, ghost.z];
    if (ghost.previousDir) {
      let [prevPathX, prevPathZ] = ghost.previousDir;
      if (
        possibleMoves.indexOf([ghost.x + prevPathX, ghost.z + prevPathZ]) > -1
      ) {
        if (Math.random() < 0.75) {
          return [ghost.x + prevPathX, ghost.z + prevPathZ];
        }
      }
    }
    let choiceIndex = Math.floor(Math.random() * possibleMoves.length);
    let choice = possibleMoves[choiceIndex];
    ghost.previousDir = [choice.x - ghost.x, choice.z - ghost.z];
    return choice;
  };

  return getBestMove();
}
