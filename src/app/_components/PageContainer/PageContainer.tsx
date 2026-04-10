import Spinner from "../Spinner/Spinner";
import styles from "./PageContainer.module.scss";

interface PageContainerProps {
  loading?: boolean;
  children?: React.ReactNode;
}

export default function PageContainer({ loading, children }: PageContainerProps) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
