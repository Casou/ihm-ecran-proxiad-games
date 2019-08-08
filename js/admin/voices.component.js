class Voices {

  constructor(selector) {
    this.selector = selector;

    this.renderAndApply();
  }

  render() {
    return `
    <div id="voices_test_input">
      <input type="text" placeholder="Saisir un texte à synthétiser" value="Texte à synthétiser pour le bouton Tester" />    
    </div>
    <table>
      <thead>
        <tr>
          <th>Langue</th>
          <th>Pitch</th>
          <th>Rate</th>
          <th>Volume</th>
          <th> </th>
        </tr>      
      </thead>
      <tbody>
        ${ ALL_VOICES.sort(this._sort).map(voice => this._renderLine(voice)).join("") }
      </tbody>
    </table>`;
  }

  renderAndApply() {
    $(this.selector).html(this.render());
  }

  _renderLine(voice) {
    return `
    <tr>
      <td>${ voice.name }</td>
      <td><input type="number" min="0" max="2" step="0.1" value="${ voice.pitch }" onChange="updateVoiceProp('${ voice.name }', 'pitch', this.value);" /></td>
      <td><input type="number" min="0" max="1.5" step="0.1" value="${ voice.rate }" onChange="updateVoiceProp('${ voice.name }', 'rate', this.value);" /></td>
      <td><input type="number" min="0" max="1" step="0.05" value="${ voice.volume }" onChange="updateVoiceProp('${ voice.name }', 'volume', this.value);" /></td>
      <td><a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testVoice('${ voice.name }');"><i class="material-icons left">volume_up</i>Tester</a></td>
    </tr>`;
  }

  _sort(a, b) {
    if (a.name.startsWith("French")) {
      return -1;
    }
    if (b.name.startsWith("French")) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  }

}