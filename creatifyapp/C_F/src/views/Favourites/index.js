import Favourites from "./Favourites";
import { connect } from "react-redux";
import {
  mapStateToProps,
  mapDispatchToProps,
} from './props';

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);