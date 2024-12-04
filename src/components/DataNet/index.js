import React, { useEffect, useState } from "react";
import DataNetsCard from "../../components/DataNet/DataNetsCard";
import { Tabs, Tab } from "@nextui-org/react";
import CreateDataNetButton from "../CreateDataNetButton";
import useWindowUtils from "../../utils/useWindowUtils";
// import { dataSetsList } from "../../utils/base-methods";

const DataNetTabs = ({
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-3 gap-5",
}) => {
  const { screenWidth } = useWindowUtils();
  const [dataNetData, setDataNetData] = useState();

  const getDataNets = async () => {
    try {
      const response = await dataSetsList();
      if (response) {
        const {
          data: { data },
        } = response;
        setDataNetData(data);
      }
    } catch (error) {
      console.log("🚀 ~ getDataNets ~ error:", error);
      handleLoginApiError(error);
    }
  };

  const handleLoginApiError = (error) => {
    let errorMessage = "An error occurred";
    if (error?.response) {
      errorMessage = error?.response?.data?.message;
    } else if (error?.request) {
      errorMessage = "No response received from server";
    }
    console.log("🚀 ~ getDataNets ~ errorMessage:", errorMessage);
  };

  useEffect(() => {
    getDataNets();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col relative">
        {screenWidth < 767 && (
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="m-0 md:hidden text-xl font-semibold text-[#0C0C0D] dark:text-white">
              DataNets
            </h2>
            <CreateDataNetButton />
          </div>
        )}
        <h2 className="m-0 hidden md:block md:absolute md:top-[0.75rem] text-xl font-semibold text-[#0C0C0D] dark:text-white">
          DataNets
        </h2>
        <Tabs
          size="lg"
          radius="md"
          aria-label="Options"
          classNames={{
            base: "justify-end w-full",
            tabList:
              "w-full md:w-fit bg-[#F9F9F9] dark:bg-[#161618] border border-[#E7E7E9] dark:border-[#3E3E3E]",
            tab: "py-[0.3rem] px-3 text-base data-[hover-unselected=true]:opacity-100 h-auto",
            cursor: " group-data-[selected=true]:bg-[#B5B6BA]",
            tabContent: "group-data-[selected=true]:font-medium",
            panel: "py-4 px-0",
          }}
        >
          <Tab key="trending" title="Trending">
            <div className={gridClassName}>
              {dataNetData &&
                Array.isArray(dataNetData) &&
                dataNetData?.map((item, idx) => (
                  <DataNetsCard key={idx} data={item} />
                ))}
            </div>
          </Tab>
          <Tab key="created" title="Created">
            <div className={gridClassName}>
              {dataNetData &&
                Array.isArray(dataNetData) &&
                dataNetData?.map((item, idx) => <DataNetsCard key={idx} />)}
            </div>
          </Tab>
          <Tab key="staked" title="Staked">
            <div className={gridClassName}>
              {dataNetData &&
                Array.isArray(dataNetData) &&
                dataNetData?.map((item, idx) => <DataNetsCard key={idx} />)}
            </div>
          </Tab>
          <Tab key="all" title="All">
            <div className={gridClassName}>
              {dataNetData &&
                Array.isArray(dataNetData) &&
                dataNetData?.map((item, idx) => <DataNetsCard key={idx} />)}
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default DataNetTabs;
