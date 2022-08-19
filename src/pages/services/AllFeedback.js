

export const getAllFeedbackApi = async (defValue) => {
  const APIUrl = process.env.REACT_APP_Base_URL;
  const token = localStorage.getItem("masters_jwt");
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data')
  myHeaders.append("Authorization", token);
  let res = await fetch(
    APIUrl + `/feedback/${defValue}`,
    {
      method: "get",
      headers: myHeaders
    }
  );
  let response = await res.json();
  const empResult = response.data;
  return empResult;
}