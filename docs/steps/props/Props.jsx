import { withTheme } from '@material-ui/core/styles';
import Markdown from '../../../libs/markdown';



class Props extends Markdown {
  getTheme(){
    return this.props.theme.palette.type;
  }
  document() {
    return require('./index.md');  
  }
}

export default withTheme()(Props)