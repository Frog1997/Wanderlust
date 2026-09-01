const fs = require('fs');
const content = fs.readFileSync('src/components/ItineraryView.tsx', 'utf8');

const targetStr = `                  {/* Inter-Item Transport Connector */}
                  {item.transportToNext && index < activeDay.items.length - 1 && (
                    <div className="my-2 ml-4 flex items-start gap-2 text-xs text-stone-500 dark:text-neutral-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0"></div>
                      
                      {item.transportToNext.routes && item.transportToNext.routes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {item.transportToNext.routes.map((route, i) => (
                            <a
                              key={i}
                              href={route.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-2.5 py-1 rounded-full text-[11px] text-primary-700 dark:text-primary-400 flex items-center gap-1.5 border border-stone-200 dark:border-neutral-700 transition-colors"
                              title={route.url}
                            >
                              {item.transportToNext?.mode === 'subway' && '🚇'}
                              {item.transportToNext?.mode === 'walk' && '🚶'}
                              {item.transportToNext?.mode === 'bus' && '🚌'}
                              {item.transportToNext?.mode === 'taxi' && '🚕'}
                              {item.transportToNext?.mode === 'bullet_train' && '🚄'}
                              <span className="font-bold">{route.label || '路線指引'}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="bg-stone-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full text-[11px] text-stone-600 dark:text-neutral-400 flex items-center gap-1.5 border border-stone-200 dark:border-neutral-700">
                          {item.transportToNext.mode === 'subway' && '🚇 地鐵轉乘'}
                          {item.transportToNext.mode === 'walk' && '🚶 步行'}
                          {item.transportToNext.mode === 'bus' && '🚌 公車'}
                          {item.transportToNext.mode === 'taxi' && '🚕 計程車'}
                          {item.transportToNext.mode === 'bullet_train' && '🚄 特急鐵路'}
                          <span>約 {item.transportToNext.durationMinutes} 分鐘</span>
                          {item.transportToNext.distanceText && (
                            <span className="text-stone-400 dark:text-neutral-600">({item.transportToNext.distanceText})</span>
                          )}
                        </span>
                      )}
                    </div>
                  )}`;

const replacement = `                  {/* Inter-Item Transport Connector */}
                  {(item.transportOptions?.length ? item.transportOptions : (item.transportToNext ? [item.transportToNext] : [])).length > 0 && index < activeDay.items.length - 1 && (
                    <div className="my-2 ml-4 flex flex-col gap-2">
                      {(item.transportOptions?.length ? item.transportOptions : (item.transportToNext ? [item.transportToNext] : [])).map((transport, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-xs text-stone-500 dark:text-neutral-500 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0"></div>
                          
                          {transport.routes && transport.routes.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {transport.routes.map((route, i) => (
                                <a
                                  key={i}
                                  href={route.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-2.5 py-1 rounded-full text-[11px] text-primary-700 dark:text-primary-400 flex items-center gap-1.5 border border-stone-200 dark:border-neutral-700 transition-colors"
                                  title={route.url}
                                >
                                  {transport.mode === 'subway' && '🚇'}
                                  {transport.mode === 'walk' && '🚶'}
                                  {transport.mode === 'bus' && '🚌'}
                                  {transport.mode === 'taxi' && '🚕'}
                                  {transport.mode === 'bullet_train' && '🚄'}
                                  {transport.mode === 'car' && '🚗'}
                                  <span className="font-bold">{route.label || '路線指引'}</span>
                                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="bg-stone-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full text-[11px] text-stone-600 dark:text-neutral-400 flex items-center gap-1.5 border border-stone-200 dark:border-neutral-700">
                              {transport.mode === 'subway' && '🚇 地鐵轉乘'}
                              {transport.mode === 'walk' && '🚶 步行'}
                              {transport.mode === 'bus' && '🚌 公車'}
                              {transport.mode === 'taxi' && '🚕 計程車'}
                              {transport.mode === 'bullet_train' && '🚄 特急鐵路'}
                              {transport.mode === 'car' && '🚗 自駕 / 租車'}
                              <span>約 {transport.durationMinutes} 分鐘</span>
                              {transport.distanceText && (
                                <span className="text-stone-400 dark:text-neutral-600">({transport.distanceText})</span>
                              )}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}`;

if(content.includes(targetStr)) {
  fs.writeFileSync('src/components/ItineraryView.tsx', content.replace(targetStr, replacement));
  console.log('Successfully replaced connector rendering section');
} else {
  console.error('Target string not found!');
  // To help debug, find some part of it
  console.log(content.includes("Inter-Item Transport Connector"));
}
