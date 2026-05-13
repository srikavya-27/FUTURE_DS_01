Papa.parse("data/superstore_cleaned.csv", {

    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

        const data = results.data;

        // KPI VARIABLES
        let totalSales = 0;
        let totalProfit = 0;
        let totalOrders = data.length;

        // DATA OBJECTS
        let categorySales = {};
        let regionProfit = {};
        let monthlySales = {};
        let segmentSales = {};
        let productSales = {};
        let monthlyProfit = {};

        // LOOP THROUGH DATA
        data.forEach(row => {

            let sales = parseFloat(row.Sales) || 0;
            let profit = parseFloat(row.Profit) || 0;

            totalSales += sales;
            totalProfit += profit;

            // CATEGORY SALES
            let category = row.Category;

            if(category){

                if(!categorySales[category]){
                    categorySales[category] = 0;
                }

                categorySales[category] += sales;
            }

            // REGION PROFIT
            let region = row.Region;

            if(region){

                if(!regionProfit[region]){
                    regionProfit[region] = 0;
                }

                regionProfit[region] += profit;
            }

            // SEGMENT SALES
            let segment = row.Segment;

            if(segment){

                if(!segmentSales[segment]){
                    segmentSales[segment] = 0;
                }

                segmentSales[segment] += sales;
            }

            // PRODUCT SALES
            let product = row["Product Name"];

            if(product){

                if(!productSales[product]){
                    productSales[product] = 0;
                }

                productSales[product] += sales;
            }

            // MONTHLY SALES & PROFIT
            let orderDate = row["Order Date"];

            if(orderDate){

                let month = orderDate.substring(0,7);

                if(!monthlySales[month]){
                    monthlySales[month] = 0;
                    monthlyProfit[month] = 0;
                }

                monthlySales[month] += sales;
                monthlyProfit[month] += profit;
            }

        });

        // PROFIT MARGIN
        let profitMargin =
            ((totalProfit / totalSales) * 100).toFixed(2);

        // UPDATE KPI CARDS
        document.getElementById("totalSales").innerText =
            "$" + totalSales.toLocaleString();

        document.getElementById("totalProfit").innerText =
            "$" + totalProfit.toLocaleString();

        document.getElementById("totalOrders").innerText =
            totalOrders.toLocaleString();

        document.getElementById("profitMargin").innerText =
            profitMargin + "%";

        // CATEGORY PIE CHART
        new Chart(document.getElementById("categoryChart"), {

            type: "pie",

            data: {

                labels: Object.keys(categorySales),

                datasets: [{
                    data: Object.values(categorySales),

                    backgroundColor: [
                        "#2563eb",
                        "#14b8a6",
                        "#f59e0b"
                    ]
                }]
            },

            options:{
                responsive:true,

                animation:{
                    duration:2000
                }
            }
        });

        // REGION BAR CHART
        new Chart(document.getElementById("regionChart"), {

            type: "bar",

            data: {

                labels: Object.keys(regionProfit),

                datasets: [{
                    label: "Profit",

                    data: Object.values(regionProfit),

                    backgroundColor: [
                        "#2563eb",
                        "#14b8a6",
                        "#f59e0b",
                        "#7c3aed"
                    ]
                }]
            },

            options:{
                responsive:true,
                maintainAspectRatio:false,

                animation:{
                    duration:2000
                }
            }
        });

        // SALES TREND CHART
        new Chart(document.getElementById("salesTrendChart"), {

            type: "line",

            data: {

                labels: Object.keys(monthlySales),

                datasets:[{
                    label:"Monthly Sales",

                    data:Object.values(monthlySales),

                    borderColor:"#2563eb",

                    backgroundColor:"rgba(37,99,235,0.2)",

                    fill:true,

                    tension:0.4
                }]
            },

            options:{
                responsive:true,
                maintainAspectRatio:false,

                animation:{
                    duration:2000
                }
            }
        });

        // SEGMENT DOUGHNUT CHART
        new Chart(document.getElementById("segmentChart"), {

            type:"doughnut",

            data:{

                labels:Object.keys(segmentSales),

                datasets:[{
                    data:Object.values(segmentSales),

                    backgroundColor:[
                        "#2563eb",
                        "#7c3aed",
                        "#14b8a6"
                    ]
                }]
            },

            options:{
                responsive:true,

                animation:{
                    duration:2000
                }
            }
        });

        // TOP PRODUCTS
        let sortedProducts = Object.entries(productSales)
            .sort((a,b) => b[1] - a[1])
            .slice(0,5);

        new Chart(document.getElementById("topProductsChart"), {

            type:"bar",

            data:{

                labels:sortedProducts.map(item => item[0]),

                datasets:[{
                    label:"Sales",

                    data:sortedProducts.map(item => item[1]),

                    backgroundColor:"#14b8a6"
                }]
            },

            options:{
                indexAxis:'y',

                responsive:true,
                maintainAspectRatio:false,

                animation:{
                    duration:2000
                }
            }
        });

        // SALES VS PROFIT
        new Chart(document.getElementById("salesProfitChart"), {

            type:"bar",

            data:{

                labels:Object.keys(monthlySales),

                datasets:[

                    {
                        label:"Sales",

                        data:Object.values(monthlySales),

                        backgroundColor:"#2563eb"
                    },

                    {
                        label:"Profit",

                        data:Object.values(monthlyProfit),

                        backgroundColor:"#14b8a6"
                    }

                ]
            },

            options:{
                responsive:true,
                maintainAspectRatio:false,

                animation:{
                    duration:2000
                }
            }
        });

        // INSIGHTS
        const insightList =
            document.getElementById("insightList");

        insightList.innerHTML = `

        <li>
        📈 Total Revenue Generated:
        <strong>$${totalSales.toLocaleString()}</strong>
        showing strong business growth performance.
        </li>

        <li>
        💰 Net Profit Earned:
        <strong>$${totalProfit.toLocaleString()}</strong>
        with a healthy profit margin of
        <strong>${profitMargin}%</strong>.
        </li>

        <li>
        🏆 Highest Revenue Category:
        <strong>${getMaxKey(categorySales)}</strong>
        indicating high customer demand.
        </li>

        <li>
        🌍 Most Profitable Region:
        <strong>${getMaxKey(regionProfit)}</strong>
        contributing significantly to business profit.
        </li>

        <li>
        👥 Best Customer Segment:
        <strong>${getMaxKey(segmentSales)}</strong>
        generated the highest purchasing activity.
        </li>

        <li>
        🔥 Top Selling Product:
        <strong>${sortedProducts[0][0]}</strong>
        achieved maximum sales revenue.
        </li>

        <li>
        📊 Monthly sales trends show seasonal fluctuations
        and opportunities for promotional campaigns.
        </li>

        <li>
        🚀 Recommendation:
        Increase investments in profitable regions
        and fast-growing product categories.
        </li>

        <li>
        📦 Improve inventory planning for high-demand
        products to maximize revenue opportunities.
        </li>
        `;
    },

    error:function(error){

        console.error("CSV Loading Error:", error);

        alert("CSV file could not be loaded.");
    }
});

// FUNCTION TO GET MAX VALUE
function getMaxKey(obj){

    return Object.keys(obj).reduce((a,b) =>
        obj[a] > obj[b] ? a : b
    );
}