
const bpc = {};

jQuery(document).ready(($) => {

    bpc.init = function init() {
        const embedded = bpc.embedMode();
        $.getJSON('examples/manifest.json', (data) => {
            const sections = Object.keys(data);
            
            for(let i = 0; i < sections.length; i++){
                let html = `<span class="section" data-section="${sections[i]}">${sections[i]}</span><ul data-section="${sections[i]}">`;
                const items = data[sections[i]];

                for (let j = 0; i < items.length; j++){
                    const plugins = typeof items[j].plugins !== 'undefined' ? items[j].plugins.join(',') : '';
                    const validVersions = typeof items[j].validVersions !== 'undefined' ? items[j].validVersions.join(',') : '';
                    html += `<li data-src="${items[j].entry}" data-plugins="${plugins}" data-validVersions="${validVersions}">${items[j].title}</li>`;
                }
                html += '</ul>';

                $('.main-menu').append(html);
            }
        });

        if(embedded){
            return ;
        }


    }




})