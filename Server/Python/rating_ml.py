import numpy as np
from typing import Dict, Optional, List
from pydantic import BaseModel
from enum import Enum
import logging
from datetime import datetime, timedelta

# Professional Types - Only Educator and Therapist
class ProfessionalType(str, Enum):
    EDUCATOR = "educator"
    THERAPIST = "therapist"

# Rating Document Model
class RatingDocument(BaseModel):
    professionalId: str
    professionalType: ProfessionalType
    rating: float  # 1-5 scale
    timestamp: datetime = None
    sessionCount: int = 1  # Number of sessions with professional

# Mock Database with Educator and Therapist Data
class RatingModel:
    """Mock database with educator and therapist ratings"""
    
    _mock_data = [
        # Educators
        RatingDocument(
            professionalId="educator1",
            professionalType=ProfessionalType.EDUCATOR,
            rating=5,
            timestamp=datetime.now() - timedelta(days=5),
            sessionCount=10
        ),
        RatingDocument(
            professionalId="educator1",
            professionalType=ProfessionalType.EDUCATOR,
            rating=4,
            timestamp=datetime.now() - timedelta(days=15),
            sessionCount=8
        ),
        # Therapists
        RatingDocument(
            professionalId="therapist1",
            professionalType=ProfessionalType.THERAPIST,
            rating=5,
            timestamp=datetime.now() - timedelta(days=3),
            sessionCount=12
        ),
        RatingDocument(
            professionalId="therapist1",
            professionalType=ProfessionalType.THERAPIST,
            rating=3,
            timestamp=datetime.now() - timedelta(days=20),
            sessionCount=5
        ),
    ]

    @classmethod
    def aggregate(cls, pipeline: List[Dict]) -> List[Dict]:
        """Mock aggregation pipeline"""
        match_stage = next((stage['$match'] for stage in pipeline if '$match' in stage), None)
        group_stage = next((stage['$group'] for stage in pipeline if '$group' in stage), None)
        
        if not match_stage or not group_stage:
            return []
            
        # Filter data based on match criteria
        filtered = [
            r for r in cls._mock_data
            if all(getattr(r, k) == v for k, v in match_stage.items())
        ]
        
        if not filtered:
            return []
        
        # Calculate aggregated values
        professional_id = filtered[0].professionalId
        ratings = [r.rating for r in filtered]
        avg_rating = np.mean(ratings)
        total_ratings = len(ratings)
        
        return [{
            "_id": professional_id,
            "averageRating": avg_rating,
            "totalRatings": total_ratings,
            "rawRatings": ratings  # Include for ML processing
        }]

# ML Rating Processor with profession-specific handling
class RatingProcessor:
    """ML-like rating processor with special handling for educators and therapists"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    def process_ratings(self, ratings: List[float], professional_type: ProfessionalType) -> float:
        """Process ratings differently for educators vs therapists"""
        if not ratings:
            return 0.0
            
        ratings_array = np.array(ratings)
        
        # Different weighting based on professional type
        if professional_type == ProfessionalType.EDUCATOR:
            # Educators: emphasize consistency (lower variance gets higher weight)
            weights = np.exp(-np.var(ratings_array)) * np.ones_like(ratings_array)
        elif professional_type == ProfessionalType.THERAPIST:
            # Therapists: emphasize recent ratings (time-decay)
            weights = np.linspace(1.5, 0.5, len(ratings_array))
        else:
            weights = np.ones_like(ratings_array)
            
        weights /= weights.sum()  # Normalize
        
        return float(np.average(ratings_array, weights=weights))

# Response Models
class RatingResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict]
    error: Optional[str] = None

# Main Service Function
async def get_professional_rating(professional_id: str, professional_type: str) -> RatingResponse:
    """Get processed rating for educator or therapist"""
    try:
        # Validate professional type
        try:
            professional_type = ProfessionalType(professional_type.lower())
        except ValueError:
            return RatingResponse(
                success=False,
                message=f"Invalid professional type. Must be one of: {[t.value for t in ProfessionalType]}"
            )
            
        # Get raw ratings data
        result = RatingModel.aggregate([
            {
                "$match": {
                    "professionalId": professional_id,
                    "professionalType": professional_type.value
                }
            },
            {
                "$group": {
                    "_id": "$professionalId",
                    "averageRating": {"$avg": "$rating"},
                    "totalRatings": {"$sum": 1},
                    "rawRatings": {"$push": "$rating"}
                }
            }
        ])
        
        if not result:
            return RatingResponse(
                success=True,
                message="No ratings found for this professional yet.",
                data={
                    "professionalId": professional_id,
                    "professionalType": professional_type.value,
                    "averageRating": 0.0,
                    "totalRatings": 0,
                    "mlProcessedRating": 0.0
                }
            )
            
        # Process with ML-like algorithm
        processor = RatingProcessor()
        ml_rating = processor.process_ratings(
            result[0]["rawRatings"],
            professional_type
        )
        
        return RatingResponse(
            success=True,
            message=f"Rating processed with {professional_type.value}-specific algorithm",
            data={
                "professionalId": professional_id,
                "professionalType": professional_type.value,
                "averageRating": round(result[0]["averageRating"], 2),
                "totalRatings": result[0]["totalRatings"],
                "mlProcessedRating": round(ml_rating, 2)
            }
        )
        
    except Exception as e:
        logging.error(f"Error in get_professional_rating: {str(e)}")
        return RatingResponse(
            success=False,
            message="Internal server error",
            error=str(e)
        )

# Example Usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Test educator rating
    print("\nEducator Results:")
    response = await get_professional_rating("educator1", "educator")
    print(response.dict())
    
    # Test therapist rating
    print("\nTherapist Results:")
    response = await get_professional_rating("therapist1", "therapist")
    print(response.dict())
    
    # Test invalid type
    print("\nInvalid Type Results:")
    response = await get_professional_rating("educator1", "doctor")
    print(response.dict())