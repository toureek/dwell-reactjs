import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/material-design-lite/material.min.css';
import '../node_modules/material-design-lite/material.min.js';
import '../node_modules/material-design-icons/iconfont/material-icons.css';
import DwellAPI from './config/DwellAPI';
import TableViewComponent from './components/TableViewComponent';
import {PullToRefresh} from "react-js-pull-to-refresh";
import {PullDownContent, ReleaseContent, RefreshContent} from "react-js-pull-to-refresh";
import InfiniteScroll from 'react-infinite-scroller';
import '../node_modules/react-infinite-scroller/dist/InfiniteScroll.js';
import { ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.isInfinityLoopCanBeTriggered = false;
    this.state = {
      serverResponse: [],
      pageNumber: 1,
      pageSize: 20,
      hasMore: true,
      uitableview: null,
    }

    this.invokeApi = this.loadDataAtFirstTime.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.loadMoreData = this.loadMoreData.bind(this);
  }

  notifyCallBack = () => toast(
    "请耐心等待 社交分享功能将在下个版本发布", 
    {
    render: "New content",
    type: toast.TYPE.SUCCESS,
    autoClose: 5000
    }
  );

  aboutProjectNotifyCallBack = () => toast(
    "第一次写java和react的前后端, 开发过程是遇到问题解决问题, 踩了很多坑, 也收获了很多, 越写越兴奋, 希望越写越好. :-)", 
    {
    render: "New content",
    type: toast.TYPE.SUCCESS,
    autoClose: 15000
    }
  );

  routeRequestToDetail = (atIndex) => {
    console.log('routeRequestToDetail+' + atIndex)
  };

  componentDidMount() {
    this.loadDataAtFirstTime();
  }

  onRefresh() {
    this.loadDataAtFirstTime();
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  loadMoreData() {
    if (this.isInfinityLoopCanBeTriggered) {
      console.log('+++++++++++++++load-more-data------------')
      var previousPageNumber = this.state.pageNumber;
      this.isInfinityLoopCanBeTriggered = false;
      this.loadDataAfterTheFirstTime(previousPageNumber+1)
    }
  }

  loadDataAtFirstTime() {
    const axios = require('axios');
    var fetchedData = null;
    const url = DwellAPI.houseList+'?pageNumber=1';
    var hasMore = false;
    axios.get(url)
      .then((response) => {
        console.log(((response['data'])['data'])['arrays']);
        fetchedData = ((response['data'])['data'])['arrays'];
        hasMore = ((response['data'])['data'])['pageTotal'] > 20
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState({
          pageNumber: 1,
          hasMore: hasMore,
          serverResponse: fetchedData,
          uitableview: <TableViewComponent datasource={fetchedData}
                                           shareButtonDidSelected={this.notifyCallBack} 
                                           itemDidSelectedAtIndex={this.routeRequestToDetail} />
        }) 
        this.isInfinityLoopCanBeTriggered = true;
      });
  }

  loadDataAfterTheFirstTime(pageNumber) {
    const axios = require('axios');
    this.isInfinityLoopCanBeTriggered = false;
    var fetchedData = this.state.serverResponse.slice();
    var newFetchedData = [];
    const url = DwellAPI.houseList+'?pageNumber='+pageNumber;
    var hasMore = false;
    axios.get(url)
    .then((response) => {
      console.log(((response['data'])['data'])['arrays']);
      newFetchedData = ((response['data'])['data'])['arrays'];
      fetchedData = [...fetchedData, ...newFetchedData];
      hasMore = ((response['data'])['data'])['pageTotal'] > 20*pageNumber
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      this.setState({
        hasMore: hasMore,
        pageNumber: pageNumber,
        serverResponse: fetchedData,
        uitableview: <TableViewComponent datasource={fetchedData}
                                         shareButtonDidSelected={this.notifyCallBack} 
                                         itemDidSelectedAtIndex={this.routeRequestToDetail} />
      }) 
      this.isInfinityLoopCanBeTriggered = true;
    }); 
  }

  render() {
    const loader = <div className="loader" style={{clear:"both"}}>Loading ...</div>;

    return (
        <div className="demo-layout-transparent mdl-layout mdl-js-layout
                        mdl-layout--fixed-header mdl-layout--fixed-tabs ">
          <header className="mdl-layout__header mdl-layout__header--transparent">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">React-Dwell v0.1</span>
              <div className="mdl-layout-spacer"></div>
              <nav className="mdl-navigation">
                <a className="mdl-navigation__link" href="https://xa.zu.ke.com/zufang/rt200600000001/" target="_blank"><b>原始数据源</b></a>
                <a className="mdl-navigation__link" href="javascript:;" onClick={this.aboutProjectNotifyCallBack}><b>关于</b></a>
                <a className="mdl-navigation__link" href="http://github.com/toureek/dwell" target="_blank"><b>Github</b></a>
                <a className="mdl-navigation__link" href="javascript:;"><b>未完待续...</b></a>
              </nav>

              <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable
               mdl-textfield--floating-label mdl-textfield--align-right">
                <label className="mdl-button mdl-js-button mdl-button--icon"
                         for="fixed-header-drawer-exp">
                  <i className="material-icons">search</i>
                </label>
              <div className="mdl-textfield__expandable-holder">
                <input className="mdl-textfield__input" type="text" name="sample"
                 id="fixed-header-drawer-exp">
                 </input>
              </div>
              </div>
            </div>

            <div className="mdl-layout__tab-bar mdl-js-ripple-effect"
                 style={{backgroundColor: '#5D43DA'}} >
                <a href="#fixed-tab-1" className="mdl-layout__tab is-active"><b>整租房源列表</b></a>
                <a href="#fixed-tab-2" className="mdl-layout__tab"><b>地图找房源</b></a>
                {/* <a href="#fixed-tab-3" className="mdl-layout__tab"><b>搜索结果</b></a> */}
            </div>
          </header>

          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">Toureek</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="javascript:;"><b>Email: june.key.young@gmail.com</b></a>
              <a className="mdl-navigation__link" href="javascript:;"><b>Objective: iOS / Java</b></a>
              <a className="mdl-navigation__link" href="javascript:;"><b>Location: China</b></a>
              <a className="mdl-navigation__link" href="javascript:;"><b>Just Do IT</b></a>
              <a className="mdl-navigation__link" href="https://www.github.com/toureek" target="_blank"><b>Github</b></a>
            </nav>
          </div>

          <main className="mdl-layout__content">
                <section className="mdl-layout__tab-panel is-active" id="fixed-tab-1">
                      <div className="pull-to-refresh">
                          <PullToRefresh
                              pullDownContent={<PullDownContent label="下拉刷新" background="none" />}
                              releaseContent={<ReleaseContent label="释放刷新" background="none" />}
                              refreshContent={<RefreshContent background="./res/img/tab-pager-view.png" />}
                              pullDownThreshold={200}
                              onRefresh={this.onRefresh}
                              triggerHeight={100}>
                              <div className="page-content">
                                <div style={{height:"900px", overflow:"auto", clear:"both"}}>
                                  <InfiniteScroll
                                      pageStart={0}
                                      useWindow={false}
                                      loadMore={this.loadMoreData}
                                      hasMore={this.state.hasMore}
                                      loader={loader}>
                                          {this.state.uitableview}
                                  </InfiniteScroll>
                                </div>
                              </div>
                          </PullToRefresh>
                      </div>
                </section>

              <section className="mdl-layout__tab-panel" id="fixed-tab-2">
                <div className="page-content">
                  <iframe className="mapView" src="https://maplab.amap.com/share/mapv/6e87616c893ffa79aa1a8c431f552c55"></iframe>
                </div>
              </section>

              {/* <section className="mdl-layout__tab-panel" id="fixed-tab-3">
                <div className="page-content">搜索结果</div>
              </section> */}
          </main>
          <ToastContainer />
      </div>
    ); 
  }
}

export default App;