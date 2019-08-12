class Pamameters {

  constructor(selector, serverParameters) {
    this.selector = selector;
    this.localParameters = [];
    this.serverParameters = serverParameters;
  }

  render() {
    return `
		<section id="local_params" class="card blue-grey darken-3">
        <h1>Paramètres locaux</h1>
        <table>
          <thead>
          <tr>
            <th>Paramètre</th>
            <th>Valeur</th>
          </tr>
          </thead>
          <tbody>
          	${this._renderLocalParameter()}
          </tbody>
        </table>
      </section>
      <section id="server_params" class="card blue-grey darken-3">
        <h1>Paramètres serveur</h1>
        <table>
          <thead>
          <tr>
            <th class="parameter_id">Id</th>
            <th class="parameter_description">Paramètre</th>
            <th class="parameter_value">Valeur</th>
          </tr>
          </thead>
          <tbody>
          	${this._renderServerParameter()}
          </tbody>
        </table>
      </section>
		`;
  }

  renderAndApply() {
    $(this.selector).html(this.render());
    $(this.selector + " .tooltip:not(.tooltipstered)").tooltipster().addClass("tooltipstered");
  }

  _renderLocalParameter() {
    return `
		<tr id="local_params__server_url">
			<td>URL du serveur</td>
			<td>
				<div class="input-field">
					<input type="text" value="${SERVER_URL}" onChange="updateServerURL(this.value);" />
					<i class="material-icons icon status"></i>
				</div>
			</td>
		</tr>
		`;
  }

  _renderServerParameter() {
    return this.serverParameters.sort((a, b) => a.id - b.id)
      .map((param) => `
        <tr>
          <td class="parameter_id tooltip" title="${param.key}">${param.key}</td>
          <td class="parameter_description">${param.description}</td>
          <td class="parameter_value">
            <div class="input-field">
              ${this._renderInput(param)}
            </div>
          </td>
        </tr>`)
      .join("");
  }

  _renderInput(parameter) {
    if (parameter.type === 'FIELDSET') {
      const css = parameter.optionals === 'terminal-style' ? 'terminal' : "";

      return `<textarea onchange="updateParameter(${parameter.id}, this.value);"
											class="${css}"
						>${parameter.value}</textarea>`;
    }
    if (parameter.type === 'BOOLEAN') {
      return `
		<div class="switch">
      <label>
        Non
        <input type="checkbox" ${parameter.value === "true" && "checked='checked'"} onchange="updateParameter(${parameter.id}, this.checked);"/>
        <span class="lever"></span>
        Oui
      </label>
    </div>
    `;
    }
    if (parameter.type === 'NUMBER') {
      return `<input type="number" value="${parameter.value}" onchange="updateParameter(${parameter.id}, this.value);" />`;
    }
    return `<input type="text" value="${parameter.value}" onchange="updateParameter(${parameter.id}, this.value);" />`;
  };
}