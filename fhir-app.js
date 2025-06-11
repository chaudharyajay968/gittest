const FHIR_BASE_URL = "http://smd-gug-sql1:8080/fhir/";

// Auto-search when typing name
$('#patientSearch').on('input', async function () {
  const query = $(this).val().trim();
  if (query.length < 2) return;

  try {
    const res = await fetch(`${FHIR_BASE_URL}/Patient?name=${encodeURIComponent(query)}&_count=10`, {
      headers: { "Accept": "application/fhir+json" }
    });

    const data = await res.json();

    $('#patientSelect').empty().append(`<option value="">-- Select Patient ID --</option>`);

    if (data.entry && data.entry.length > 0) {
      data.entry.forEach(entry => {
        const patient = entry.resource;
        const name = patient.name?.[0]?.given?.[0] + " " + patient.name?.[0]?.family;
        $('#patientSelect').append(
          `<option value="${patient.id}">${name} (ID: ${patient.id})</option>`
        );
      });
    } else {
      $('#patientSelect').append(`<option value="">No results found</option>`);
    }
  } catch (error) {
    console.error("Search error:", error);
  }
});

async function fetchPatientDetails() {
  const patientId = $('#patientSelect').val();
  if (!patientId) return;

  try {
    const res = await fetch(`${FHIR_BASE_URL}/Patient/${patientId}`, {
      headers: { "Accept": "application/fhir+json" }
    });

    const patient = await res.json();

    const firstName = patient.name?.[0]?.given?.[0] || "N/A";
    const lastName = patient.name?.[0]?.family || "N/A";
    const gender = patient.gender || "N/A";
    const dob = patient.birthDate || "N/A";
    const address = patient.address?.[0]?.text || "N/A";

    $('#firstName').text(firstName);
    $('#lastName').text(lastName);
    $('#gender').text(gender);
    $('#dob').text(dob);
    $('#address').text(address);
  } catch (error) {
    console.error("Failed to fetch patient:", error);
  }
}
