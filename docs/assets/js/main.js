var win = navigator.platform.indexOf('Win') > -1;
if (win && document.querySelector('#sidenav-scrollbar')) {
    var options = {
        damping: '0.5'
    }
    Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
}

let mappingNameHuToEn = {
    "Dél-Alföld": "Southern<br>Great Plains",
    "Észak-Alföld": "Northern<br>Great Plain",
    "Észak-Magyarország": "Northern<br>Hungary",
    "Dél-Dunántúl": "South<br>Transdanubia",
    "Nyugat-Dunántúl": "Western<br>Transdanubia",
    "Közép-Dunántúl": "Central<br>Transdanubia",
    "Pest Megye": "Pest county",
    "Budapest": "Budapest",
    "Ősz": "Autumn",
    "Tél": "Winter",
    "Tavasz": "Spring",
    "Nyár": "Summer",
    "Illegális": "Illegally deposited",
    "Közteres": "Public cleaning",
    "SZTSZH": "Selective municipal solid waste (SMSW)",
    "VTSZH": "Mixed municipal solid waste (MSW)",
}
function changeArrayNameHuToEn(arr) {
    return arr.map(value => (mappingNameHuToEn.hasOwnProperty(value) ? mappingNameHuToEn[value] : value));
}

$(document).ready(function () {
    $.ajax({
        url: "./filesOutput.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            for (const file of data.data) {
                $("#sidenav-collapse-main > ul").append(`
                    <li class="nav-item">
                        <a class="nav-link text-white sidenav-collapse-main-link" id="${file._id}">
                            
                            <span class="nav-link-text ms-1">${file.year} ${file.fileName}</span>
                        </a>
                    </li>
                `);

                let strElement = '';
                strElement += `
                            <div class="col-12 mb-3">
                                <div class="card my-4">
                                    <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                        <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                            <h6 class="text-white text-capitalize ps-3">Data table</h6>
                                        </div>
                                    </div>
                                    <div class="card-body px-0 pb-2">
                                        <div class="table-responsive p-0">
                                            <table class="table align-items-center justify-content-center mb-0">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                `;
                for (const category in file.collected_data.summary) {
                    strElement += `
                                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">${category}</th>
                    `;
                }
                strElement += `                                   
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                `;
                for (const category in file.collected_data.summary) {
                    for (region in file.collected_data.summary[category].oItems) {
                        strElement += `
                                                    <tr>
                                                        <td class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">${mappingNameHuToEn[region]}</td>
                        `;
                        for (const category in file.collected_data.summary) {
                            strElement += `
                                                        <td class="mb-0 text-sm">${file.collected_data.summary[category].oItems[region]}</td>
                            `;
                        }
                        strElement += `
                                                    </tr>
                        `;

                    }
                    strElement += `
                                                    <tr><td></td></tr>
                                                    <tr>
                                                        <td class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Hungary</td>
                        `;
                    for (const category in file.collected_data.summary) {
                        strElement += `
                                                        <td class="mb-0 text-sm">
                                                        ${file.collected_data.summary[category]['Cw']}
                                                        <br>
                                                        ±${file.collected_data.summary[category]['Su*']}
                                                        </td>
                                                        
                            `;
                    }
                    strElement += `
                                                    </tr>
                    `;
                    break;
                }
                strElement += ` 
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `;

                for (const category in file.collected_data.summary) {
                    strElement += `
                            <div class="col-md-12 col-lg-12 mb-3">
                                <div class="card my-4">
                                    <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                        <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                            <h6 class="text-white text-capitalize ps-3">${category}</h6>
                                        </div>
                                    </div>
                                    <div class="card-body px-0 pb-2">
                                        <div class="chart-container">
                                            <div style="position: relative; height:60vh; width:100%" id='chart_${category}_${file._id}'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                }
                $("#mainDiv").append(`<div id="div_${file._id}" class="col-12 mainDivs" style="display: none;"><div class="row">${strElement}</div></div>`);

                let chartTitleParameters = changeArrayNameHuToEn(file.fileName.split("-"));

                for (const category in file.collected_data.summary) {

                    var data = [{
                        type: 'bar',
                        x: changeArrayNameHuToEn(Object.keys(file.collected_data.summary[category].oItems)),
                        y: Object.values(file.collected_data.summary[category].oItems),
                        text: Object.values(file.collected_data.summary[category].oItems).map(d => d.toFixed(3)),
                        textfont: { size: 12 },
                        name: 'C',
                        marker: {
                            color: 'rgb(40, 101, 161, 0.6)'
                        }
                    },
                    {
                        type: 'bar',
                        x: ['Hungary'],
                        y: [file.collected_data.summary[category]['Cw']],

                        name: 'C',
                        marker: {
                            // color: 'rgb(55, 83, 109)'
                            color: 'rgb(95, 182, 99, 0.6)'
                        }
                    },
                    {
                        type: 'scatter',
                        x: ['Hungary'],
                        y: [file.collected_data.summary[category]['Cw']],
                        text: [`${file.collected_data.summary[category]['Cw'].toFixed(3)}<br>±${file.collected_data.summary[category]['Su*'].toFixed(3)}`],
                        textfont: { size: 14 },
                        textposition: 'top center',
                        mode: 'markers+text',


                        name: 'Sn*',
                        error_y: {
                            type: 'data',
                            array: [file.collected_data.summary[category]['Su*'], file.collected_data.summary[category]['Su*']],
                            width: 10,
                            thickness: 0.5,
                            color: '#000'
                        }
                    }];

                    var layout = {
                        title: `Campaign: ${chartTitleParameters[0]} ${file.year} <br> Waste stream: ${chartTitleParameters[1]} <br> Component: ${capitalizeFirstLetter(category)} waste`,
                        autosize: true,
                        width: null,
                        height: null,
                        font: {
                            family: 'var(--bs-body-font-family)',
                            size: 14,
                            color: '#333'
                        },
                        xaxis: {
                            tickangle: 90,
                            tickfont: {
                                size: 12,
                            },
                        },
                        yaxis: {
                            title: `component content<br>C [%m/m]`,
                            range: [0, 75]
                        },
                        showlegend: false
                    };

                    Plotly.newPlot(`chart_${category}_${file._id}`, data, layout, { displayModeBar: false, responsive: true });
                }
            }
            $(".sidenav-collapse-main-link").on("click", function (event) {
                let id = $(event.target).attr("id");

                $("#sidenav-collapse-main > ul > li > a").removeClass("active");
                $("#sidenav-collapse-main > ul > li > a").removeClass("bg-gradient-primary");
                $(event.target).addClass("active");
                $(event.target).addClass("bg-gradient-primary");

                $(".breadcrumb_fileName").text(($(event.target).text()).replace("pin_drop ", ""));
                $('.mainDivs').hide();
                $('#div_' + id).show();

            });

            $("#sidenav-collapse-main ul li:first a").click();

            // window.dispatchEvent(new Event('resize'));
        },
        error: function (data) {
            console.log(data);
        },
    });

    $("#exportChartsToWord").click(function () {
        exportChartsToWordFn()
    });
});

function capitalizeFirstLetter(sentence) {
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

// exportChartsToWord
let elementChartObj = [];
async function makeObjChartElement() {
    elementChartObj = [];
    const charts = document.querySelectorAll(".chart-container");
    for (const chart of charts) {
        let elementId = chart.firstElementChild.id;

        elementChartObj.push(
            new docx.Paragraph({
                children: [
                    new docx.ImageRun({
                        data: await Plotly.toImage(elementId, {
                            format: 'png',
                            width: 1200,
                            height: 800,
                        }),
                        transformation: {
                            width: 600,
                            height: 400,
                        },
                    }),
                ],
            }),
        );
    }
}
async function exportChartsToWordFn() {
    $("#exportChartsToWord").attr("disabled", true);
    await makeObjChartElement();

    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                new docx.Paragraph({
                    text: "Landfill Analytical",
                    heading: docx.HeadingLevel.HEADING_1,
                    alignment: docx.AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),
                ...elementChartObj
            ],
        }]
    });

    docx.Packer.toBlob(doc).then(blob => {
        let now = new Date();
        let filename = now.getFullYear() + '-' +
            ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) + '-' +
            ('0' + now.getMinutes()).slice(-2) + '-' +
            ('0' + now.getSeconds()).slice(-2);

        saveAs(blob, filename + ".docx");
    });
    setTimeout(function () {
        $("#exportChartsToWord").attr("disabled", false);
    }, 2000);
}







