import dayjs from "dayjs";

const epochPoints = [
  {
    created: "2024-09-30T08:12:46.616Z",
    total: 528,
    network: 250,
    referral: 100,
    rank: 25,
    space: 153,
  },
  {
    created: "2024-09-29T07:52:45.553Z",
    total: 484,
    network: 302,
    referral: 182,
    rank: 0,
    space: 0,
  },
  {
    created: "2024-09-28T10:55:18.718Z",
    total: 358,
    network: 100,
    referral: 0,
    rank: 158,
    space: 100,
  },
  {
    created: "2024-09-27T06:29:18.647Z",
    total: 613,
    network: 303,
    referral: 0,
    rank: 110,
    space: 200,
  },
  {
    created: "2024-09-26T07:47:49.406Z",
    total: 505,
    network: 505,
    referral: 0,
    rank: 0,
    space: 0,
  },
  {
    created: "2024-09-25T06:50:23.536Z",
    total: 771,
    network: 471,
    referral: 0,
    rank: 0,
    space: 300,
  },
  {
    created: "2024-09-24T05:19:41.302Z",
    total: 345,
    network: 100,
    referral: 200,
    rank: 45,
    space: 0,
  },
  {
    created: "2024-09-23T07:31:41.045Z",
    total: 422,
    network: 112,
    referral: 0,
    rank: 130,
    space: 182,
  },
  {
    created: "2024-09-22T07:33:30.244Z",
    total: 683,
    network: 603,
    referral: 0,
    rank: 180,
    space: 0,
  },
  {
    created: "2024-09-21T10:18:20.504Z",
    total: 603,
    network: 400,
    referral: 103,
    rank: 100,
    space: 0,
  },
];

// Function to calculate the percentage
export const calculatePercentage = (value, total) => (value / total) * 10;

// Step 1: Find the maximum total value
export const maxTotal = (data) => {
  return Math.max(...data.map((point) => point?.total_points));
};

// export const epochPointsWithHeight = (
//   data,
//   maximumTotal,
//   realTimeData,
//   rewardsRealTimeDataArray,
//   checkRealtimeDateinHistory
// ) => {
//   const found = rewardsRealTimeDataArray.find((item) =>
//     dayjs(item.date).isSame(dayjs(checkRealtimeDateinHistory), "day")
//   );

//   const todayHeartBeats = {
//     date: checkRealtimeDateinHistory,
//     details: [
//       {
//         claim_type: 3,
//         points: Number(rewardsRealTimeDataArray[0]?.total_heartbeats),
//       },
//     ],
//     total_points: Number(rewardsRealTimeDataArray[0]?.total_heartbeats),
//   };
//   console.log("foundfoundfound", found);
//   if (found !== undefined) {
//     data.push(todayHeartBeats);
//   }

//   const newData = data.map((point) => {
//     const chartHeight = (point.total_points / maximumTotal) * 10;
//     const total_points =
//       rewardsRealTimeDataArray[0]?.date === point?.date
//         ? point.total_points +
//           Number(rewardsRealTimeDataArray[0]?.total_heartbeats)
//         : point.total_points;
//     const claimMining = point.details.find((e) => e.claim_type === 3);
//     if (rewardsRealTimeDataArray[0]?.date === point?.date) {
//       if (Number(rewardsRealTimeDataArray[0]?.total_heartbeats) > 0) {
//         if (claimMining === undefined) {
//           point.details.push({
//             claim_type: 3,
//             points: Number(rewardsRealTimeDataArray[0]?.total_heartbeats),
//           });
//         } else {
//           claimMining.points = Number(
//             rewardsRealTimeDataArray[0]?.total_heartbeats
//           );
//         }
//       }
//     }

//     const detailsGet = point.details.map((pointDetail) => {
//       return {
//         ...pointDetail,
//         reward_type:
//           pointDetail.claim_type == 1
//             ? "referral"
//             : pointDetail.claim_type == 2
//             ? "mission"
//             : pointDetail.claim_type == 3
//             ? "mining"
//             : pointDetail.claim_type == 4
//             ? "tier"
//             : pointDetail.claim_type == 5
//             ? "bonus"
//             : "",
//       };
//     });
//     const details = detailsGet.sort((a, b) => a.claim_type - b.claim_type);
//     return {
//       ...point,
//       total_points,
//       details,
//       chartHeight: `${
//         Math.floor(chartHeight) > 0 ? chartHeight : chartHeight + 0.4
//       }rem`, // Add the calculated rem value to the object
//     };
//   });
//   return newData;
// };
// export const epochPointsWithHeight = (
//   data,
//   maximumTotal,
//   realTimeData,
//   rewardsRealTimeDataArray,
//   checkRealtimeDateinHistory
// ) => {
//   const found = rewardsRealTimeDataArray?.find((item) =>
//     dayjs(item.date).isSame(dayjs(checkRealtimeDateinHistory), "day")
//   );

//   const todayHeartBeats = {
//     date: rewardsRealTimeDataArray[0]?.date,
//     details: [
//       {
//         claim_type: 3,
//         points: Number(rewardsRealTimeDataArray[0]?.total_heartbeats),
//       },
//     ],
//     total_points: Number(rewardsRealTimeDataArray[0]?.total_heartbeats),
//   };
//   if (!found) {
//     data?.push(todayHeartBeats);
//   }
//   const newData = data.map((point) => {
//     const chartHeight = (point.total_points / maximumTotal) * 10;
//     const total_points =
//       rewardsRealTimeDataArray[0]?.date === point?.date
//         ? point.total_points +
//           Number(rewardsRealTimeDataArray[0]?.total_heartbeats)
//         : point.total_points;
//     const claimMining = point?.details?.find((e) => e.claim_type === 3);
//     if (rewardsRealTimeDataArray[0]?.date === point?.date) {
//       if (Number(rewardsRealTimeDataArray[0]?.total_heartbeats) > 0) {
//         if (claimMining === undefined) {
//           point.details.push({
//             claim_type: 3,
//             points: Number(rewardsRealTimeDataArray[0]?.total_heartbeats),
//           });
//         } else {
//           claimMining.points = Number(
//             rewardsRealTimeDataArray[0]?.total_heartbeats
//           );
//         }
//       }
//     }

//     const detailsGet = point.details.map((pointDetail) => {
//       return {
//         ...pointDetail,
//         reward_type:
//           pointDetail.claim_type == 1
//             ? "referral"
//             : pointDetail.claim_type == 2
//             ? "mission"
//             : pointDetail.claim_type == 3
//             ? "mining"
//             : pointDetail.claim_type == 4
//             ? "tier"
//             : pointDetail.claim_type == 5
//             ? "bonus"
//             : "",
//       };
//     });
//     const details = detailsGet.sort((a, b) => a.claim_type - b.claim_type);
//     return {
//       ...point,
//       total_points,
//       details,
//       chartHeight: `${
//         Math.floor(chartHeight) > 0 ? chartHeight : chartHeight + 0.4
//       }rem`, // Add the calculated rem value to the object
//     };
//   });
//   return newData;
// };

export const epochPointsWithHeight = (data, maximumTotal, realTimeData) => {
  const newData = data.map((point) => {
    const chartHeight = (point.total_points / maximumTotal) * 10;

    const detailsGet = point.details.map((pointDetail) => {
      return {
        ...pointDetail,
        reward_type:
          pointDetail.claim_type == 1
            ? "referral"
            : pointDetail.claim_type == 2
            ? "mission"
            : pointDetail.claim_type == 3
            ? "heartbeats" //heartbeats
            : pointDetail.claim_type == 4
            ? "tier"
            : pointDetail.claim_type == 5
            ? "bonus"
            : "",
      };
    });
    const details = detailsGet.sort((a, b) => a.claim_type - b.claim_type);
    return {
      ...point,
      // total_points,
      details,
      chartHeight: `${
        Math.floor(chartHeight) > 0 ? chartHeight : chartHeight + 0.4
      }rem`, // Add the calculated rem value to the object
    };
  });
  return newData;
};

// Old one
// Step 2: Calculate rem values based on the ratio to the maximum total
// export const epochPointsWithHeight = (data, maximumTotal, realTimeData) => {
//   const newData = data.map((point) => {
//     const chartHeight = (point.total_points / maximumTotal) * 10;
//     const total_points =
//       Number(realTimeData) > 0
//         ? point.total_points + Number(realTimeData)
//         : point.total_points;
//     const claimMining = point.details.find((e) => e.claim_type === 3);
//     if (Number(realTimeData) > 0) {
//       if (claimMining === undefined) {
//         point.details.push({
//           claim_type: 3,
//           points: Number(realTimeData),
//         });
//       } else {
//         claimMining.points = Number(realTimeData);
//       }
//     }

//     const detailsGet = point.details.map((pointDetail) => {
//       return {
//         ...pointDetail,
//         reward_type:
//           pointDetail.claim_type == 1
//             ? "referral"
//             : pointDetail.claim_type == 2
//             ? "mission"
//             : pointDetail.claim_type == 3
//             ? "mining"
//             : pointDetail.claim_type == 4
//             ? "tier"
//             : pointDetail.claim_type == 5
//             ? "bonus"
//             : "",
//       };
//     });
//     const details = detailsGet.sort((a, b) => a.claim_type - b.claim_type);
//     return {
//       ...point,
//       total_points,
//       details,
//       chartHeight: `${
//         Math.floor(chartHeight) > 0 ? chartHeight : chartHeight + 0.4
//       }rem`, // Add the calculated rem value to the object
//     };
//   });
//   return newData;
// };

// Step 1: Find the most recent entry by comparing dates
export const latestEntry = (data) => {
  if (data.length === 0) return null; // Return null if data is empty
  const sortedData = data.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  return sortedData[0].date;
  // return data.reduce((latest, current) => {
  //   return new Date(current?.date) > new Date(latest?.date) ? current : latest;
  // });
};

const sortData = (data, order = "asc") => {
  return data.sort((a, b) => {
    const diff = dayjs(a.date).diff(dayjs(b.date));
    return order === "asc" ? diff : -diff;
  });
};
// Step 1: Find the most recent entry by comparing dates
export const checkRealtimeEntry = (rewardsHistoryData) => {
  if (rewardsHistoryData.length === 0) return null; // Return null if data is empty
  const sortedDataVal = sortData(rewardsHistoryData, "desc");
  // rewardsHistoryData.sort((a, b) =>
  //   dayjs(a.date).diff(dayjs(b.date)),
  // );
  return sortedDataVal[0].date;
  // return rewardsHistoryData.reduce((latest, current) => {
  //   return new Date(current.created) > new Date(latest.created)
  //     ? current
  //     : latest;
  // });
};

// Step 2: Calculate rem values based on the ratio to the maximum total
export const realTimeDataHeightCalc = (realTimeData, maximumTotal) => {
  const chartHeight = (realTimeData.total / maximumTotal) * 10;

  return {
    ...realTimeData,
    chartHeight: `${
      Math.floor(chartHeight) > 0 ? chartHeight : chartHeight + 0.4
    }rem`, // Add the calculated rem value to the object
  };
};
