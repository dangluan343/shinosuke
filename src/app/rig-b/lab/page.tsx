import { redirect } from 'next/navigation';

/** Trang lab riêng của Rig B đã gộp vào /rig-lab. */
export default function RigBLabRedirect() {
  redirect('/rig-lab?rig=b');
}
