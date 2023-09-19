"use client";

import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCard";

const Plans = () => {
  const [plans, setPlans] = useState<TPrice[]>([]);

  const getPlans = async () => {
    const res = await fetch("/api/getPlans");
    const data = await res.json();
    console.log(data.data);

    setPlans(data.data);
  };

  useEffect(() => {
    getPlans();
  }, []);
  return (
    <div className="flex gap-3">
      {plans.map((plan: TPrice) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default Plans;
