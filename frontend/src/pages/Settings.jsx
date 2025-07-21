import React, { useState } from 'react';
// import DialogResetPassword from './DialogResetPassword';
// import DialogChangeEmail from './DialogChangeEmail';
// import DialogDeleteAccount from './DialogPrivacy';
// import DialogExportHistory from './DialogExportHistory';
// import DialogPrivacy from './DialogPrivacy';
import DialogChangeTheme from './DialogChangeTheme';

export default function Settings () { 
  const [openDialog, setOpenDialog] = useState ('');
  
  const open = (name) => setOpenDialog(name);
  const close = () => setOpenDialog ('');

  return (
    <div className="setting-container">
    <h1>Setting</h1>
    <button onClick={() => open('reset')}>Rest Password</button>
    <button onClick={() => open('email')}>Change Email</button>
    <button onClick={() => open('delete')}>Delete Account</button>
    <button onClick={() => open('export')}>Export Log History</button>
    <button onClick={() => open('privacy')}>Privacy / Delete Data</button>
    <button onClick={() => open('theme')}>Change Theme</button>
    <button onClick={() => window.location.href = '/dashboard'}></button> 

    {openDialog === 'reset' && <DialogResetPassword onClose={close} />}
    {openDialog === 'email'&& <DialogChangeEmail onClose={close} />}
    {openDialog === 'delete' && <DialogDeleteAccount onClose={close} />}
    {openDialog === 'export' && <DialogExportHistory onClose={close} />}
    {openDialog === 'privacy' && <DialogPrivacy onClose={close} />}
    {openDialog === 'theme' && <DialogChangeTheme onClose={close} />}
    
    </div>
  );
}

    