import { cli } from "../parameters/cli";
import { Remote } from "./interfaces";
import { LiveTldListerService } from "./live/domains";
import { LiveEmailProviderListerService } from "./live/email-providers";
import LiveHubspotService from "./live/hubspot";
import { LiveMarketplaceService } from "./live/marketplace";
import { MemoryTldListerService } from "./memory/domains";
import { MemoryEmailProviderListerService } from "./memory/email-providers";
import { MemoryHubspot } from "./memory/hubspot";
import { MemoryMarketplace } from "./memory/marketplace";

export class IO {

  public static fromCli() {
    return new IO({
      in: cli.getChoiceOrFail('--in', ['local', 'remote']),
      out: cli.getChoiceOrFail('--out', ['local', 'remote']),
    });
  }

  public in: Remote;
  public out: Remote;

  public constructor(opts: { in: 'local' | 'remote', out: 'local' | 'remote' }) {
    if (opts.in === opts.out) {
      // Important that it's the same instance!
      this.in = this.out = remoteFor(opts.in);
    }
    else {
      this.in = remoteFor(opts.in);
      this.out = remoteFor(opts.out);
    }
  }

}

function remoteFor(opt: 'local' | 'remote'): Remote {
  switch (opt) {
    case 'local': return new MemoryRemote();
    case 'remote': return new LiveRemote();
  }
}

class MemoryRemote implements Remote {
  marketplace = new MemoryMarketplace();
  tldLister = new MemoryTldListerService();
  emailProviderLister = new MemoryEmailProviderListerService();
  hubspot = new MemoryHubspot();
}

class LiveRemote implements Remote {
  hubspot = new LiveHubspotService();
  marketplace = new LiveMarketplaceService();
  emailProviderLister = new LiveEmailProviderListerService();
  tldLister = new LiveTldListerService();
}
