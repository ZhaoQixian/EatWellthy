import React, { useState } from "react";

const SelectFoodComponent = () => {
  // 定义一个 state 用于存储选中的值
  const [selectedOption, setSelectedOption] = useState("");

  // 处理选中值变化的函数
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected option:", event.target.value);
  };

  return (
    <div>
      <h3>选择一个水果:</h3>
      
      {/* select 元素 */}
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">请选择一个选项</option> {/* 默认提示 */}
        <option value="apple">苹果</option>
        <option value="banana">香蕉</option>
        <option value="orange">橙子</option>
        <option value="grape">葡萄</option>
      </select>

      {/* 显示选中的值 */}
      <p>你选择的是: {selectedOption}</p>
    </div>
  );
};

export default SelectFoodComponent;
