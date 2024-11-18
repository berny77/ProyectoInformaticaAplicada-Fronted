import pdf from '../../assets/icons/pdf.png'
export const getFileLogo = (fileType: string) => {
  switch (fileType) {
    case 'text/plain':
      return (
        <img
          width="100"
          height="100"
          src="https://img.icons8.com/fluency/100/notepad.png"
          alt="notepad"
        />
      );
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      return (
        /*  <img
           width="144"
           height="144"
           src="https://img.icons8.com/color/144/ms-word.png"
           alt="ms-word"
         /> */
        <img width="100" height="100" src="https://img.icons8.com/papercut/100/word.png" alt="word" />);
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return (
        /*  <img
           width="144"
           height="144"
           src="https://img.icons8.com/color/144/ms-excel.png"
           alt="ms-excel"
         /> */
        <img src="https://img.icons8.com/color/100/xls.png" alt="xls" />
      );
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      return (
        <img
          width="100"
          height="100"
          src="https://img.icons8.com/color/100/ppt.png"
          alt="ppt"
        />
      );
    case 'pdf':
      return (
        <img src={pdf} alt="pdf" />);
    default:
      return <span>Tipo desconocido</span>;
  }
};
