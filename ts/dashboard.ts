/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MDashboard {

    export class DashboardManager {
        static $inject = ['Api'];

        constructor(private api : Utils.Api, private $rootScope : ng.IRootScopeService) {
        }
    }

    export class Controller {
        static $inject = ['$scope', 'Api', '$location', 'ZoneManager'];

        constructor(private $scope : any, private api : Utils.Api, private $location : ng.ILocationService, private zoneMgr: MZone.ZoneManager) {
            var cpu = new kendo.data.ObservableObject({
                name: '处理器',
                total: 0,
                available: 0,
                percent: 0
            });
            var memory =  new kendo.data.ObservableObject({
                name: '内存',
                total: 0,
                available: 0,
                percent: 0
            });
            var priCap = new kendo.data.ObservableObject({
                name: '主存储',
                total: 0,
                available: 0,
                percent: 0
            });
            var backupCap = new kendo.data.ObservableObject({
                name: '备份存储',
                total: 0,
                available: 0,
                percent: 0
            });
            var ip = new kendo.data.ObservableObject({
                name: 'IP 地址',
                total: 0,
                available: 0,
                percent: 0
            });

            $scope.capacityGrid = {
                resizable: true,
                scrollable: true,
                pageable: false,
                columns: [
                    {
                        field: 'name',
                        title: '属性名称',
                        width: '25%'
                    },
                    {
                        field: 'total',
                        title: '总量',
                        width: '25%'
                    },
                    {
                        field: 'available',
                        title: '可用量',
                        width: '25%'
                    },
                    {
                        field: 'percent',
                        title: '可用比例',
                        width: '25%'
                    }
                ],

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            var chain = new Utils.Chain();
                            chain.then(()=>{
                                api.getMemoryCpuCapacityByAll((ret: ApiHeader.APIGetCpuMemoryCapacityReply)=>{
                                    cpu.set('total', Utils.toHZString(ret.totalCpu));
                                    cpu.set('available', Utils.toHZString(ret.availableCpu));
                                    cpu.set('percent', Utils.toPercentageString(ret.totalCpu == 0 ? 0 : ret.availableCpu / ret.totalCpu));

                                    memory.set('total',Utils.toSizeString(ret.totalMemory));
                                    memory.set('available',Utils.toSizeString(ret.availableMemory));
                                    memory.set('percent', Utils.toPercentageString(ret.totalMemory == 0 ? 0 : ret.availableMemory / ret.totalMemory));
                                });
                                chain.next();
                            }).then(()=>{
                                api.getPirmaryStorageCapacityByAll((ret: ApiHeader.APIGetPrimaryStorageCapacityReply)=>{
                                    priCap.set('total', Utils.toSizeString(ret.totalCapacity));
                                    priCap.set('available', Utils.toSizeString(ret.availableCapacity));
                                    priCap.set('percent', Utils.toPercentageString(ret.totalCapacity == 0 ? 0 : ret.availableCapacity / ret.totalCapacity));
                                });
                                chain.next();
                            }).then(()=>{
                                api.getBackupStorageCapacityByAll((ret: ApiHeader.APIGetBackupStorageCapacityReply)=>{
                                    backupCap.set('total', Utils.toSizeString(ret.totalCapacity));
                                    backupCap.set('available', Utils.toSizeString(ret.availableCapacity));
                                    backupCap.set('percent', Utils.toPercentageString(ret.totalCapacity == 0 ? 0 : ret.availableCapacity / ret.totalCapacity));
                                });
                                chain.next();
                            }).then(()=>{
                                api.getIpAddressCapacityByAll((ret: ApiHeader.APIGetIpAddressCapacityReply)=>{
                                    ip.set('total', ret.totalCapacity);
                                    ip.set('available', ret.availableCapacity);
                                    ip.set('percent', Utils.toPercentageString(ret.totalCapacity == 0 ? 0 : ret.availableCapacity / ret.totalCapacity));
                                });
                                chain.next();
                            }).start();

                            options.success({
                                data: [
                                    cpu,
                                    memory,
                                    priCap,
                                    backupCap,
                                    ip
                                ],
                                total: 5
                            });
                        }
                    }
                })
            };

            var vm = new kendo.data.ObservableObject({
                name: '虚拟机实例',
                link: 'vmInstance',
                amount: 0
            });
            var volume = new kendo.data.ObservableObject({
                name: '卷',
                link: 'volume',
                amount: 0
            });
            var securityGroup = new kendo.data.ObservableObject({
                name: '安全组',
                link: 'securityGroup',
                amount: 0
            });
            var eip = new kendo.data.ObservableObject({
                name: '弹性IP',
                link: 'eip',
                amount: 0
            });
            var portForwarding = new kendo.data.ObservableObject({
                name: '端口转发',
                link: 'portForwarding',
                amount: 0
            });
            var zone = new kendo.data.ObservableObject({
                name: '域',
                link: 'zone',
                amount: 0
            });
            var cluster = new kendo.data.ObservableObject({
                name: '集群',
                link: 'cluster',
                amount: 0
            });
            var host = new kendo.data.ObservableObject({
                name: '主机',
                link: 'host',
                amount: 0
            });
            var primaryStorage = new kendo.data.ObservableObject({
                name: '主存储',
                link: 'primaryStorage',
                amount: 0
            });
            var backupStorage = new kendo.data.ObservableObject({
                name: '备份存储',
                link: 'backupStorage',
                amount: 0
            });
            var l2Network = new kendo.data.ObservableObject({
                name: '二层网络',
                link: 'l2Network',
                amount: 0
            });
            var l3Network = new kendo.data.ObservableObject({
                name: '三层网络',
                link: 'l3Network',
                amount: 0
            });
            var instanceOffering = new kendo.data.ObservableObject({
                name: '配置模板',
                link: 'instanceOffering',
                amount: 0
            });
            var diskOffering = new kendo.data.ObservableObject({
                name: '磁盘模板',
                link: 'diskOffering',
                amount: 0
            });
            var vrOffering = new kendo.data.ObservableObject({
                name: '虚拟路由模板',
                link: 'virtualRouterOffering',
                amount: 0
            });
            var image = new kendo.data.ObservableObject({
                name: '镜像',
                link: 'image',
                amount: 0
            });
            var virtualRouter = new kendo.data.ObservableObject({
                name: '虚拟路由',
                link: 'virtualRouter',
                amount: 0
            });

            $scope.resourceAmountGrid = {
                resizable: true,
                scrollable: true,
                pageable: false,
                columns: [
                    {
                        field: 'name',
                        title: '资源名称',
                        template: '<a href="/\\#/{{dataItem.link}}">{{dataItem.name}}</a>',
                        width: '50%'
                    },
                    {
                        field: 'amount',
                        title: '统计',
                        width: '50%'
                    }
                ],

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            var chain = new Utils.Chain();
                            chain.then(()=>{
                                var msg = new ApiHeader.APIQueryVmInstanceMsg();
                                msg.count = true;
                                msg.conditions = [{
                                    name: 'type',
                                    op: '=',
                                    value: 'UserVm'
                                }];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryVmInstanceReply)=>{
                                    vm.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryVolumeMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryVolumeReply)=>{
                                    volume.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQuerySecurityGroupMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQuerySecurityGroupReply)=>{
                                    securityGroup.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryEipMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryEipReply)=>{
                                    eip.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryPortForwardingRuleMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryPortForwardingRuleReply)=>{
                                    portForwarding.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryZoneMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryZoneReply)=>{
                                    zone.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryClusterMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryClusterReply)=>{
                                    cluster.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryHostMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryHostReply)=>{
                                    host.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryPrimaryStorageMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryPrimaryStorageReply)=>{
                                    primaryStorage.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryBackupStorageMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryBackupStorageReply)=>{
                                    backupStorage.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryL2NetworkMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryL2NetworkReply)=>{
                                    l2Network.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryL3NetworkMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryL3NetworkReply)=>{
                                    l3Network.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryInstanceOfferingMsg();
                                msg.count = true;
                                msg.conditions = [{
                                    name: 'type',
                                    op: '=',
                                    value: 'UserVm'
                                }];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryInstanceOfferingReply)=>{
                                    instanceOffering.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryDiskOfferingMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryDiskOfferingReply)=>{
                                    diskOffering.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryVirtualRouterOfferingMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryVirtualRouterOfferingReply)=>{
                                    vrOffering.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryImageMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryImageReply)=>{
                                    image.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryApplianceVmMsg();
                                msg.count = true;
                                msg.conditions = [{
                                    name: 'applianceVmType',
                                    op: '=',
                                    value: 'VirtualRouter'
                                }];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryApplianceVmReply)=>{
                                    virtualRouter.set('amount', ret.total);
                                });
                                chain.next();
                            }).start();

                            options.success({
                                data: [
                                    vm,
                                    volume,
                                    securityGroup,
                                    eip,
                                    portForwarding,
                                    zone,
                                    cluster,
                                    host,
                                    image,
                                    primaryStorage,
                                    backupStorage,
                                    l2Network,
                                    l3Network,
                                    virtualRouter,
                                    instanceOffering,
                                    diskOffering,
                                    vrOffering
                                ],
                                total: 16
                            });
                        }
                    }
                })
            };
        }
    }
}

angular.module('root').factory('DashboardManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MDashboard.DashboardManager(api, $rootScope);
}]).config(['$routeProvider', function(route) {
    route.when('/dashboard', {
        templateUrl: '/static/templates/dashboard/dashboard.html',
        controller: 'MDashboard.Controller'
    });
}]);
