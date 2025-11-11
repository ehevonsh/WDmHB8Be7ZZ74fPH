const getDateByUnixTime = (unixTime) => {
  return new Date(unixTime * 1000).toLocaleString();
};

export default getDateByUnixTime;
