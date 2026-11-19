import { redirect } from 'next/navigation';

/** Trang lab riêng của Rig A đã gộp vào /rig-lab. */
export default function RigALabRedirect() {
  redirect('/rig-lab?rig=a');
}
