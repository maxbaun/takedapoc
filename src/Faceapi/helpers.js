export const getEyeCenter = (eye) => {
  return {
    x: (eye[3].x - eye[0].x) / 2 + eye[0].x,
    y: eye[3].y,
  };
};

export const getMouthCenter = (mouth) => {
  return {
    x: mouth[3].x,
    y: (mouth[18].y - mouth[14].y) / 2 + mouth[14].y,
  };
};
