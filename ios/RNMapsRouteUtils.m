
#import "RNMapsRouteUtils.h"

@implementation RNMapsRouteUtils

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getRouteDetails:(NSDictionary *)placemarks callback:(RCTResponseSenderBlock)callback){
    
    double originLatitude = [[placemarks objectForKey:@"originLatitude"] doubleValue];
    double originLongitude = [[placemarks objectForKey:@"originLongitude"] doubleValue];
    double destinationLatitude = [[placemarks objectForKey:@"destinationLatitude"] doubleValue];
    double destinationLongitude = [[placemarks objectForKey:@"destinationLongitude"] doubleValue];
    
    
    MKPlacemark *placemarkOne = [[MKPlacemark alloc] initWithCoordinate:CLLocationCoordinate2DMake(originLatitude, originLongitude)];
    MKPlacemark *placemarkTwo = [[MKPlacemark alloc] initWithCoordinate:CLLocationCoordinate2DMake(destinationLatitude, destinationLongitude)];
    
    RCTLog(@"placemark 1: %@", placemarkOne);
    RCTLog(@"placemark 2: %@", placemarkTwo);
    
    MKMapItem *sourceMapItem = [[MKMapItem alloc] initWithPlacemark:placemarkOne];
    MKMapItem *destinationMapItem = [[MKMapItem alloc] initWithPlacemark:placemarkTwo];
    
    MKDirectionsRequest *request = [[MKDirectionsRequest alloc] init];
    [request setSource:sourceMapItem];
    [request setDestination:destinationMapItem];
    [request setTransportType:MKDirectionsTransportTypeWalking];
    [request setRequestsAlternateRoutes:NO];
    
    MKDirections *directions = [[MKDirections alloc] initWithRequest:request];
    
    [directions calculateDirectionsWithCompletionHandler:^(MKDirectionsResponse *response, NSError *error) {
        if(error) {
            RCTLog(@"Error with address: %@", error.localizedFailureReason);
        }
        if ( ! error && [response routes] > 0) {
            MKRoute *route = [[response routes] objectAtIndex:0];
            
            NSDictionary *successDict =@{
                                         @"eta": [NSNumber numberWithDouble:route.expectedTravelTime],
                                         @"distance": [NSNumber numberWithDouble: route.distance]
                                         };
            
            callback(@[successDict]);
        }
    }];
}
    
@end
    
