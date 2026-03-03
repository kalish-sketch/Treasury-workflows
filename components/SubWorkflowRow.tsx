import { SubWorkflow } from '@/types';

interface SubWorkflowRowProps {
  sub: SubWorkflow;
}

export default function SubWorkflowRow({ sub }: SubWorkflowRowProps) {
  return (
    <tr className="sub-row">
      <td></td>
      <td></td>
      <td><span className="sub-name">{'\u21B3'} {sub.name}</span></td>
      <td colSpan={2}></td>
      <td style={{ fontSize: '11px' }}>{sub.how}</td>
      <td className="pain-text">{sub.pain}</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
}
