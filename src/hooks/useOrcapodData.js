import { useState, useEffect } from "react";

export function useOrcapodData()  {
    // Load initial data directly from localStorage
    const [viewers, setViewers] = useState(() => JSON.parse(localStorage.getItem("viewers")) || []);
    const [statuses, setStatuses] = useState(() => JSON.parse(localStorage.getItem("statuses")) || []);
    const [views, setViews] = useState(() => JSON.parse(localStorage.getItem("views")) || {});

    // Save data anytime state changes
    useEffect(() => {
        localStorage.setItem("viewers", JSON.stringify(viewers));
        localStorage.setItem("statuses", JSON.stringify(statuses));
        localStorage.setItem("views", JSON.stringify(views));
      }, [viewers, statuses, views ]);

    // Return the data and the setters
    return { viewers, setViewers, statuses, setStatuses, views, setViews };
}

