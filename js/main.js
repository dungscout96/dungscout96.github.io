/* ========================================
   Theme Toggle + Publication Filters + Cite Modal
   ======================================== */

// --- Dark Mode ---
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    icon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    icon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  }
}

// Restore saved theme
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
})();

// --- Publication Filters ---
function filterPubs(topic, btn) {
  document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.pub-card');
  const yearGroups = document.querySelectorAll('.pub-year-group');

  if (topic === 'all') {
    cards.forEach(c => c.style.display = '');
    yearGroups.forEach(g => g.style.display = '');
    return;
  }

  cards.forEach(card => {
    const topics = card.getAttribute('data-topics') || '';
    card.style.display = topics.includes(topic) ? '' : 'none';
  });

  yearGroups.forEach(group => {
    const visibleCards = group.querySelectorAll('.pub-card:not([style*="display: none"])');
    group.style.display = visibleCards.length > 0 ? '' : 'none';
  });
}

// --- Cite Modal ---
function showCite(key) {
  const data = CITATIONS[key];
  if (!data) return;

  let overlay = document.getElementById('cite-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cite-overlay';
    overlay.className = 'cite-overlay';
    overlay.innerHTML = `
      <div class="cite-modal">
        <div class="cite-modal-header">
          <h3 id="cite-title">Cite</h3>
          <button class="cite-close" onclick="closeCite()">&times;</button>
        </div>
        <div class="cite-tabs">
          <button class="cite-tab active" onclick="switchCiteTab('bibtex', this)">BibTeX</button>
          <button class="cite-tab" onclick="switchCiteTab('apa', this)">APA</button>
        </div>
        <div class="cite-content" id="cite-content"></div>
        <button class="cite-copy-btn" onclick="copyCite()">
          <i class="fa-regular fa-copy"></i> Copy to clipboard
        </button>
      </div>
    `;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeCite();
    });
    document.body.appendChild(overlay);
  }

  window._currentCiteKey = key;
  window._currentCiteFormat = 'bibtex';
  document.getElementById('cite-title').textContent = data.title;
  document.getElementById('cite-content').textContent = data.bibtex;
  overlay.classList.add('active');

  // Reset tab state
  overlay.querySelectorAll('.cite-tab').forEach(t => t.classList.remove('active'));
  overlay.querySelector('.cite-tab').classList.add('active');

  // Reset copy button
  const btn = overlay.querySelector('.cite-copy-btn');
  btn.classList.remove('copied');
  btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy to clipboard';
}

function closeCite() {
  const overlay = document.getElementById('cite-overlay');
  if (overlay) overlay.classList.remove('active');
}

function switchCiteTab(format, btn) {
  const data = CITATIONS[window._currentCiteKey];
  if (!data) return;
  window._currentCiteFormat = format;

  document.querySelectorAll('.cite-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cite-content').textContent = data[format];

  // Reset copy button
  const copyBtn = document.querySelector('.cite-copy-btn');
  copyBtn.classList.remove('copied');
  copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy to clipboard';
}

function copyCite() {
  const content = document.getElementById('cite-content').textContent;
  navigator.clipboard.writeText(content).then(() => {
    const btn = document.querySelector('.cite-copy-btn');
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy to clipboard';
    }, 2000);
  });
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCite();
});

// --- Citation Data ---
const CITATIONS = {
  "eeglab-portal-2021": {
    title: "The open EEGLAB portal interface (2021)",
    bibtex: `@article{martinez2021open,
  title={The open {EEGLAB} portal interface: High-performance computing with {EEGLAB}},
  author={Mart{\\'\\i}nez-Cancino, Ram\\'on and Delorme, Arnaud and Truong, Dung and Artoni, Fiorenzo and Kreutz-Delgado, Kenneth and Sivagnanam, Subhashini and Yoshimoto, Kenneth and Majumdar, Amitava and Makeig, Scott},
  journal={NeuroImage},
  volume={224},
  pages={116778},
  year={2021},
  publisher={Academic Press},
  doi={10.1016/j.neuroimage.2020.116778}
}`,
    apa: `Martínez-Cancino, R., Delorme, A., Truong, D., Artoni, F., Kreutz-Delgado, K., Sivagnanam, S., Yoshimoto, K., Majumdar, A., & Makeig, S. (2021). The open EEGLAB portal interface: High-performance computing with EEGLAB. NeuroImage, 224, 116778. https://doi.org/10.1016/j.neuroimage.2020.116778`
  },
  "bids-limo-2021": {
    title: "From BIDS-formatted EEG data to sensor-space group results (2021)",
    bibtex: `@article{pernet2021bids,
  title={From {BIDS}-formatted {EEG} data to sensor-space group results: a fully reproducible workflow with {EEGLAB} and {LIMO} {EEG}},
  author={Pernet, Cyril R and Martinez-Cancino, Ramon and Truong, Dung and Makeig, Scott and Delorme, Arnaud},
  journal={Frontiers in Neuroscience},
  volume={14},
  pages={610388},
  year={2021},
  publisher={Frontiers},
  doi={10.3389/fnins.2020.610388}
}`,
    apa: `Pernet, C. R., Martinez-Cancino, R., Truong, D., Makeig, S., & Delorme, A. (2021). From BIDS-formatted EEG data to sensor-space group results: A fully reproducible workflow with EEGLAB and LIMO EEG. Frontiers in Neuroscience, 14, 610388. https://doi.org/10.3389/fnins.2020.610388`
  },
  "hed-neuroimage-2021": {
    title: "Capturing the nature of events using HED (2021)",
    bibtex: `@article{robbins2021capturing,
  title={Capturing the nature of events and event context using {Hierarchical Event Descriptors} ({HED})},
  author={Robbins, Kay and Truong, Dung and Appelhoff, Stefan and Delorme, Arnaud and Makeig, Scott},
  journal={NeuroImage},
  volume={245},
  pages={118766},
  year={2021},
  publisher={Academic Press},
  doi={10.1016/j.neuroimage.2021.118766}
}`,
    apa: `Robbins, K., Truong, D., Appelhoff, S., Delorme, A., & Makeig, S. (2021). Capturing the nature of events and event context using Hierarchical Event Descriptors (HED). NeuroImage, 245, 118766. https://doi.org/10.1016/j.neuroimage.2021.118766`
  },
  "deep-cnn-eeg-2021": {
    title: "Deep CNN Applied to EEG: Raw Data vs Spectral Features (2021)",
    bibtex: `@inproceedings{truong2021deep,
  title={Deep Convolutional Neural Network Applied to Electroencephalography: Raw Data vs Spectral Features},
  author={Truong, Dung and Milham, Michael and Makeig, Scott and Delorme, Arnaud},
  booktitle={2021 43rd Annual International Conference of the IEEE Engineering in Medicine \\& Biology Society (EMBC)},
  pages={1--4},
  year={2021},
  organization={IEEE},
  doi={10.1109/EMBC46164.2021.9630210}
}`,
    apa: `Truong, D., Milham, M., Makeig, S., & Delorme, A. (2021). Deep Convolutional Neural Network Applied to Electroencephalography: Raw Data vs Spectral Features. In 2021 43rd Annual International Conference of the IEEE Engineering in Medicine & Biology Society (EMBC) (pp. 1–4). IEEE. https://doi.org/10.1109/EMBC46164.2021.9630210`
  },
  "nemar-2022": {
    title: "NEMAR: An open access data, tools, and compute resource (2022)",
    bibtex: `@article{delorme2022nemar,
  title={{NEMAR}: An open access data, tools, and compute resource operating on {NeuroElectroMagnetic} data},
  author={Delorme, Arnaud and Truong, Dung and Youn, Choonhan and Sivagnanam, Subhashini and Yoshimoto, Kenneth and Poldrack, Russell A and Majumdar, Amit and Makeig, Scott},
  journal={Database},
  volume={2022},
  pages={baac096},
  year={2022},
  publisher={Oxford University Press},
  doi={10.1093/database/baac096}
}`,
    apa: `Delorme, A., Truong, D., Youn, C., Sivagnanam, S., Yoshimoto, K., Poldrack, R. A., Majumdar, A., & Makeig, S. (2022). NEMAR: An open access data, tools, and compute resource operating on NeuroElectroMagnetic data. Database, 2022, baac096. https://doi.org/10.1093/database/baac096`
  },
  "bids-tools-2021": {
    title: "Tools for Importing and Evaluating BIDS-EEG Formatted Data (2021)",
    bibtex: `@inproceedings{delorme2021tools,
  title={Tools for Importing and Evaluating {BIDS}-{EEG} Formatted Data},
  author={Delorme, Arnaud and Truong, Dung and Martinez-Cancino, Ramon and Pernet, Cyril and Sivagnanam, Subhashini and others},
  booktitle={2021 10th International IEEE/EMBS Conference on Neural Engineering (NER)},
  pages={210--213},
  year={2021},
  organization={IEEE},
  doi={10.1109/NER49283.2021.9441399}
}`,
    apa: `Delorme, A., Truong, D., Martinez-Cancino, R., Pernet, C., Sivagnanam, S., et al. (2021). Tools for Importing and Evaluating BIDS-EEG Formatted Data. In 2021 10th International IEEE/EMBS Conference on Neural Engineering (NER) (pp. 210–213). IEEE. https://doi.org/10.1109/NER49283.2021.9441399`
  },
  "hed-fair-2022": {
    title: "Building FAIR functionality: annotating events using HED (2022)",
    bibtex: `@article{robbins2022building,
  title={Building {FAIR} functionality: Annotating events in time series data using {Hierarchical Event Descriptors} ({HED})},
  author={Robbins, Kay and Truong, Dung and Jones, Alexander and Callanan, Ian and Makeig, Scott},
  journal={Neuroinformatics},
  volume={20},
  number={2},
  pages={463--481},
  year={2022},
  publisher={Springer},
  doi={10.1007/s12021-021-09537-4}
}`,
    apa: `Robbins, K., Truong, D., Jones, A., Callanan, I., & Makeig, S. (2022). Building FAIR functionality: Annotating events in time series data using Hierarchical Event Descriptors (HED). Neuroinformatics, 20(2), 463–481. https://doi.org/10.1007/s12021-021-09537-4`
  },
  "nsg-2020": {
    title: "Neuroscience Gateway enabling large scale modeling (2020)",
    bibtex: `@inproceedings{sivagnanam2020neuroscience,
  title={Neuroscience Gateway enabling large scale modeling and data processing in neuroscience research},
  author={Sivagnanam, Subhashini and Yoshimoto, Kenneth and Carnevale, Ted and Nadeau, Daniel and Kandes, Mahidhar and others},
  booktitle={Practice and Experience in Advanced Research Computing},
  pages={510--513},
  year={2020},
  doi={10.1145/3311790.3399621}
}`,
    apa: `Sivagnanam, S., Yoshimoto, K., Carnevale, T., Nadeau, D., Kandes, M., et al. (2020). Neuroscience Gateway enabling large scale modeling and data processing in neuroscience research. In Practice and Experience in Advanced Research Computing (pp. 510–513). https://doi.org/10.1145/3311790.3399621`
  },
  "streamable-eeg-2022": {
    title: "A streamable large-scale clinical EEG dataset for Deep Learning (2022)",
    bibtex: `@inproceedings{truong2022streamable,
  title={A streamable large-scale clinical {EEG} dataset for Deep Learning},
  author={Truong, Dung and Sinha, Mridul and Venkataraju, Kiran U and Milham, Michael and Delorme, Arnaud},
  booktitle={2022 44th Annual International Conference of the IEEE Engineering in Medicine \\& Biology Society (EMBC)},
  pages={1--4},
  year={2022},
  organization={IEEE}
}`,
    apa: `Truong, D., Sinha, M., Venkataraju, K. U., Milham, M., & Delorme, A. (2022). A streamable large-scale clinical EEG dataset for Deep Learning. In 2022 44th Annual International Conference of the IEEE Engineering in Medicine & Biology Society (EMBC) (pp. 1–4). IEEE.`
  },
  "hbn-eeg-2024": {
    title: "HBN-EEG: The FAIR implementation of the HBN EEG dataset (2024)",
    bibtex: `@article{shirazi2024hbn,
  title={{HBN}-{EEG}: The {FAIR} implementation of the {Healthy Brain Network} ({HBN}) electroencephalography dataset},
  author={Shirazi, Seyed Yahya and Franco, Alexandre Rosa and Hoffmann, Mateus Scopel and Esper, Nathalia Bianchini and Truong, Dung and others},
  journal={bioRxiv},
  pages={2024.10.03.615261},
  year={2024},
  doi={10.1101/2024.10.03.615261}
}`,
    apa: `Shirazi, S. Y., Franco, A. R., Hoffmann, M. S., Esper, N. B., Truong, D., et al. (2024). HBN-EEG: The FAIR implementation of the Healthy Brain Network (HBN) electroencephalography dataset. bioRxiv, 2024.10.03.615261. https://doi.org/10.1101/2024.10.03.615261`
  },
  "eeg-foundation-2025": {
    title: "EEG Foundation Challenge (NeurIPS 2025)",
    bibtex: `@article{aristimunha2025eeg,
  title={{EEG} Foundation Challenge: From Cross-Task to Cross-Subject {EEG} Decoding},
  author={Aristimunha, Bruno and Truong, Dung and Guetschel, Pierre and Shirazi, Seyed Yahya and Guyon, Isabelle and Franco, Alexandre Rosa and others},
  journal={arXiv preprint arXiv:2506.19141},
  year={2025}
}`,
    apa: `Aristimunha, B., Truong, D., Guetschel, P., Shirazi, S. Y., Guyon, I., Franco, A. R., et al. (2025). EEG Foundation Challenge: From Cross-Task to Cross-Subject EEG Decoding. arXiv preprint arXiv:2506.19141. https://arxiv.org/abs/2506.19141`
  },
  "assessing-dl-eeg-2021": {
    title: "Assessing learned features of Deep Learning applied to EEG (2021)",
    bibtex: `@inproceedings{truong2021assessing,
  title={Assessing learned features of Deep Learning applied to {EEG}},
  author={Truong, Dung and Makeig, Scott and Delorme, Arnaud},
  booktitle={2021 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)},
  pages={1--4},
  year={2021},
  organization={IEEE}
}`,
    apa: `Truong, D., Makeig, S., & Delorme, A. (2021). Assessing learned features of Deep Learning applied to EEG. In 2021 IEEE International Conference on Bioinformatics and Biomedicine (BIBM) (pp. 1–4). IEEE.`
  },
  "spatial-attention-2023": {
    title: "Deep learning applied to EEG with spatial attention (2023)",
    bibtex: `@inproceedings{truong2023deep,
  title={Deep learning applied to {EEG} data with different montages using spatial attention},
  author={Truong, Dung and Khalid, Muhammad Awais and Delorme, Arnaud},
  booktitle={2023 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)},
  pages={1--4},
  year={2023},
  organization={IEEE}
}`,
    apa: `Truong, D., Khalid, M. A., & Delorme, A. (2023). Deep learning applied to EEG data with different montages using spatial attention. In 2023 IEEE International Conference on Bioinformatics and Biomedicine (BIBM) (pp. 1–4). IEEE.`
  },
  "eeg-ssl-2024": {
    title: "EEG-SSL: A Framework for Self-Supervised Learning on EEG (2024)",
    bibtex: `@inproceedings{truong2024eegssl,
  title={{EEG}-{SSL}: A Framework for Self-Supervised Learning on {EEG}},
  author={Truong, Dung and Khalid, Muhammad Awais and Delorme, Arnaud},
  booktitle={2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)},
  pages={1--4},
  year={2024},
  organization={IEEE}
}`,
    apa: `Truong, D., Khalid, M. A., & Delorme, A. (2024). EEG-SSL: A Framework for Self-Supervised Learning on EEG. In 2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM) (pp. 1–4). IEEE.`
  },
  "data-norm-2025": {
    title: "Data Normalization Strategies for EEG Deep Learning (2025)",
    bibtex: `@article{truong2025normalization,
  title={Data Normalization Strategies for {EEG} Deep Learning},
  author={Truong, Dung and Delorme, Arnaud},
  journal={arXiv preprint arXiv:2506.22455},
  year={2025}
}`,
    apa: `Truong, D., & Delorme, A. (2025). Data Normalization Strategies for EEG Deep Learning. arXiv preprint arXiv:2506.22455. https://arxiv.org/abs/2506.22455`
  },
  "fine-tuning-eeg-2025": {
    title: "Fine-Tuning Large EEG Model with Real-World Stress Data (2025)",
    bibtex: `@article{wang2025finetuning,
  title={From Theory to Application: Fine-Tuning Large {EEG} Model with Real-World Stress Data},
  author={Wang, Shuo and Zhang, Shu and Chen, Wei-Long and Truong, Dung and Jung, Tzyy-Ping},
  journal={arXiv preprint arXiv:2505.23042},
  year={2025}
}`,
    apa: `Wang, S., Zhang, S., Chen, W.-L., Truong, D., & Jung, T.-P. (2025). From Theory to Application: Fine-Tuning Large EEG Model with Real-World Stress Data. arXiv preprint arXiv:2505.23042. https://arxiv.org/abs/2505.23042`
  },
  "iclabel-python-2024": {
    title: "Automatic EEG IC Classification Using ICLabel in Python (2024)",
    bibtex: `@inproceedings{delorme2024iclabel,
  title={Automatic {EEG} Independent Component Classification Using {ICLabel} in Python},
  author={Delorme, Arnaud and Truong, Dung and Pion-Tonachini, Luca and Makeig, Scott},
  booktitle={2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)},
  pages={1--4},
  year={2024},
  organization={IEEE}
}`,
    apa: `Delorme, A., Truong, D., Pion-Tonachini, L., & Makeig, S. (2024). Automatic EEG Independent Component Classification Using ICLabel in Python. In 2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM) (pp. 1–4). IEEE.`
  },
  "hed-schema-2023": {
    title: "HED library schema for EEG data annotation (2023)",
    bibtex: `@article{hermes2023hierarchical,
  title={Hierarchical Event Descriptor library schema for {EEG} data annotation},
  author={Hermes, Dora and Attia, Tal Pal and Beniczky, S\\'andor and Bosch-Bayard, Jorge and Delorme, Arnaud and others},
  journal={arXiv preprint arXiv:2310.15173},
  year={2023}
}`,
    apa: `Hermes, D., Attia, T. P., Beniczky, S., Bosch-Bayard, J., Delorme, A., et al. (2023). Hierarchical Event Descriptor library schema for EEG data annotation. arXiv preprint arXiv:2310.15173. https://arxiv.org/abs/2310.15173`
  },
  "e2e-bids-2023": {
    title: "End-to-end processing of M/EEG data with BIDS, HED, and EEGLAB (2023)",
    bibtex: `@incollection{truong2023endtoend,
  title={End-to-end processing of {M/EEG} data with {BIDS}, {HED}, and {EEGLAB}},
  author={Truong, Dung and Robbins, Kay and Delorme, Arnaud and Makeig, Scott},
  booktitle={Methods for Analyzing Large Neuroimaging Datasets},
  editor={Whelan, Robert and others},
  year={2023}
}`,
    apa: `Truong, D., Robbins, K., Delorme, A., & Makeig, S. (2023). End-to-end processing of M/EEG data with BIDS, HED, and EEGLAB. In R. Whelan et al. (Eds.), Methods for Analyzing Large Neuroimaging Datasets.`
  },
  "nemar-platform-2026": {
    title: "NEMAR: Open-source platform analysis (2026)",
    bibtex: `@article{brandmeyer2026nemar,
  title={Neuroelectromagnetic Data Archive and Repository: Open-source platform analysis},
  author={Brandmeyer, Tracy and Riggs, Adam and Reddi, Vishal and Sullivan, Hannah and Youn, Choonhan and Sivagnanam, Subhashini and others},
  journal={Aperture Neuro},
  volume={6},
  number={SI 1},
  year={2026}
}`,
    apa: `Brandmeyer, T., Riggs, A., Reddi, V., Sullivan, H., Youn, C., Sivagnanam, S., et al. (2026). Neuroelectromagnetic Data Archive and Repository: Open-source platform analysis. Aperture Neuro, 6(SI 1).`
  }
};
