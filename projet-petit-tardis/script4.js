function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });

    // Show the selected section
    var selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
};

var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20(); // D3 color scale

// Charger le fichier JSON
fetch('episodes.json')
    .then(response => response.json())  // Transformer la réponse en objet JSON
    .then(data => {
        // Maintenant, data est disponible, vous pouvez manipuler la roue ici
        var svg = d3.select('#chart')
            .append("svg")
            .data([data]) // Utilisez les données ici
            .attr("width", w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
        
        var vis = container.append("g");

        var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });

        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice")
            .data(pie(data)) // Utiliser data ici pour les slices
            .enter()
            .append("g")
            .attr("class", "slice");

        arcs.append("path")
            .attr("fill", function (d, i) { return color(i); })
            .attr("d", function (d) { return arc(d); });

        // Ajouter le texte à chaque tranche de la roue
        arcs.append("text")
            .attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle) / 2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
            })
            .attr("text-anchor", "end")
            .text(function (d, i) {
                return data[i].label;  // Affiche le label de chaque saison
            });

        // Fonction pour effectuer un tour de roue
        container.on("click", spin);

        function spin(d) {
            container.on("click", null);

            var ps = 360 / data.length,
                pieslice = Math.round(1440 / data.length),
                rng = Math.floor((Math.random() * 1440) + 360);

            rotation = (Math.round(rng / ps) * ps);

            picked = Math.round(data.length - (rotation % 360) / ps);
            picked = picked >= data.length ? (picked % data.length) : picked;

            if (oldpick.indexOf(picked) !== -1) {
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }

            rotation += 90 - Math.round(ps / 2);

            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function () {
                    // Afficher le resultat du tour de roue
                    d3.select("#resultat p")
                        .text(data[picked].resultat);

                    oldrotation = rotation;
                    container.on("click", spin);  // Réactiver le clic après la rotation
                });
        }

        function rotTween(to) {
            var i = d3.interpolate(oldrotation % 360, rotation);
            return function (t) {
                return "rotate(" + i(t) + ")";
            };
        }

        // Dessiner la flèche de la roue
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
            .style({ "fill": "black" });

        // Dessiner le cercle pour le bouton "Spin"
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .style({ "fill": "white", "cursor": "pointer" });

        // Texte pour "Spin"
        container.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({ "font-weight": "bold", "font-size": "30px" });

    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier JSON:', error);
    });
