import React, { useEffect } from 'react'
import { useLink } from '../../context/LinkContext'

function SuccessAlert() {
  const {alertState, setAlertState} = useLink();

  useEffect(() => {
    if (alertState.isOn) {
      const timer = setTimeout(() => {
        setAlertState({ isOn: false, message: '' });
      }, 2000); // 1000 milliseconds = 1 second

      return () => clearTimeout(timer); 
    }
  }, [alertState]);

  return (
    <div className='success-alert' style={{display: alertState.isOn ? 'block' : 'none'}}>{alertState.message}</div>
  )
}

export default SuccessAlert
