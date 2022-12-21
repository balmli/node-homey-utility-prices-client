import Homey from "homey/lib/Homey";

export class UtilityBillApi {

    logger: any;
    utilityBillApi: any;

    constructor({logger, homey}: {
        logger: any,
        homey: Homey
    }) {
        this.logger = logger;
        this.utilityBillApi = homey.api.getApiApp('no.almli.utilitycost');
    }

    async fetchPrices() {
        if (await this._checkApi()) {
            try {
                return await this.utilityBillApi.get('/prices');
            } catch (err) {
                this.logger('Fetching prices from the Norwegian Electricity Bill app failed: ', err);
            }
        }
    }

    private async _checkApi() {
        try {
            const isInstalled = await this.utilityBillApi.getInstalled();
            const version = await this.utilityBillApi.getVersion();
            if (isInstalled && !!version) {
                const split = version.split('.');
                let apiOk = (Number(split[0]) >= 1 && Number(split[1]) >= 4);
                this.logger(`Norwegian Electricity Bill: ${version} installed${apiOk ? ' and ready' : ', but not ready'}`, split);
                return apiOk;
            } else {
                this.logger(`Norwegian Electricity Bill: not installed`);
            }
        } catch (err: any) {
            this.logger(`Checking Norwegian Electricity Bill API: ${err.message}`);
        }
        return false;
    }

}