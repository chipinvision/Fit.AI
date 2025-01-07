import React from 'react';
import styles from './MadeWith.module.css';

/**
 * Props for the MadeWith component.
 */
export interface MadeWithProps {
  /**
   * The name of the developer.
   */
  developerName: string;
  /**
   * The URL of the developer's website.
   */
  developerWebsite: string;
}

const MadeWith: React.FC<MadeWithProps> = ({
  developerName,
  developerWebsite,
}) => (
  <div className={styles.madeWith}>
    Engineered by{' '}
    <b><a href={developerWebsite} target="_blank" rel="noopener noreferrer">
      {developerName}
    </a></b>
  </div>
);

export default MadeWith;