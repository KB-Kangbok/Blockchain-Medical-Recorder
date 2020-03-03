import React, { useEffect } from "react";
import PostsService from "../services/apiservice"

export default function View(props) {
  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    const apiResponse = await PostsService.queryRecords(props.userId, props.userId);
    console.log(apiResponse);
  }
  return (
    <div className="View">
      <div className="lander">
        <h1>This is view page</h1>
      </div>
    </div>
  );
}