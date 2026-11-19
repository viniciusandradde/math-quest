import { expressionLabel, kit, poseLabel, type Expression, type Pose } from '../app/kit';

type Common = { className?: string; decorative?: boolean };

export function Mascot({ expression, className = '', decorative = false }: Common & { expression: Expression }) {
  return <img src={kit.expression(expression)} alt={decorative ? '' : expressionLabel[expression]} draggable={false} className={'mascot-shadow select-none ' + className} />;
}

export function MascotPose({ pose, className = '', decorative = false }: Common & { pose: Pose }) {
  return <img src={kit.pose(pose)} alt={decorative ? '' : poseLabel[pose]} draggable={false} className={'mascot-shadow select-none ' + className} />;
}
