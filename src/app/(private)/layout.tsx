import NavBar from "@/app/_components/NavBar/NavBar";
import Sidebar from "@/app/_components/Sidebar/Sidebar";
import styles from "./layout.module.scss";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <NavBar />
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
